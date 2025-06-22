const feeder = document.getElementById("feeder");
let isLoading = false;
let noMorePosts = false;
let CURRENT_USER_GOOGLE_ID = null;
let SEEN_SET = new Set(); // To avoid duplicates

// Load user first
async function loadCurrentUser() {
  try {
    const res = await fetch("/api/user/me");
    const data = await res.json();
    CURRENT_USER_GOOGLE_ID = data.google_id;
    fetchFypPosts();
  } catch (err) {
    console.error("Failed to get user:", err);
  }
}

// Like toggle
async function likePost(postId, button) {
  try {
    const res = await fetch("/likes/toggle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ post_id: postId })
    });

    const data = await res.json();
    const span = button.querySelector("span");
    let count = parseInt(span.textContent) || 0;
    span.textContent = data.liked ? count + 1 : count - 1;
    button.classList.toggle("liked", data.liked);
  } catch (err) {
    console.error("Like failed:", err);
  }
}

// Seen marker
function markPostAsSeen(postId) {
  if (SEEN_SET.has(postId)) return;
  SEEN_SET.add(postId);

  fetch("/seen", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ google_id: CURRENT_USER_GOOGLE_ID, post_id: postId })
  });
}

// Observer for visibility
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const postId = entry.target.dataset.postId;

    // Mark post as seen once it's mostly visible
    if (entry.isIntersecting) {
      if (!entry.target.classList.contains("seen")) {
        entry.target.classList.add("seen");
        markPostAsSeen(postId);
      }

      // Play video if it exists inside this post container
      const video = entry.target.querySelector("video");
      if (video) {
        video.play().catch(e => {
          // Handle play() rejection, e.g. autoplay policy
          // console.log("Video play failed:", e);
        });
      }

    } else {
      // Pause video when it's out of view
      const video = entry.target.querySelector("video");
      if (video) {
        video.pause();
      }
    }
  });
}, {
  threshold: 0.75,
  rootMargin: "0px 0px -25% 0px"
});

// Fetch posts
async function fetchFypPosts() {
  if (isLoading || !CURRENT_USER_GOOGLE_ID || noMorePosts) return;
  isLoading = true;

  try {
    const res = await fetch(`/fyp/batch?limit=4&viewerGoogleId=${CURRENT_USER_GOOGLE_ID}`);
    const posts = await res.json();

    if (posts.length === 0) {
      noMorePosts = true;
      console.log("🛑 No more posts.");
      return;
    }

    posts.forEach(post => {
      const container = document.createElement("div");
      container.className = "post-container";
      container.dataset.postId = post.post_id;

      const header = document.createElement("div");
      header.className = "post-header";
      header.innerHTML = `
        <img src="${post.profile_pic}" class="profile-pic" />
        <span class="display-name">${post.display_name}</span>
      `;

      let media;
      if (post.image_url) {
        media = document.createElement("img");
        media.src = post.image_url;
      } else if (post.video_url) {
        media = document.createElement("video");
        media.src = post.video_url;
        media.controls = true;
        media.muted = true;      // <--- important for autoplay!
        media.playsInline = true;

        // Toggle play/pause on click
        media.addEventListener("click", () => {
          if (media.paused) {
            media.play().catch(e => {
              // Optional: handle error if play rejected
            });
          } else {
            media.pause();
          }
        });

        media.style.cursor = "pointer"; // visual hint it's clickable
      }

      media.className = "post-media";

      const actions = document.createElement("div");
      actions.className = "post-actions";

      const likeBtn = document.createElement("button");
      likeBtn.innerHTML = `<i class='bx bx-like'></i> <span>${post.like_count}</span>`;
      likeBtn.id = "likeBtn";
      if (post.liked_by_viewer) likeBtn.classList.add("liked");

      likeBtn.onclick = () => likePost(post.post_id, likeBtn);

      const commentBtn = document.createElement("button");
      commentBtn.innerHTML = "<i class='bx bx-comment'></i>";
      commentBtn.id = "commentBtn";

      actions.append(likeBtn, commentBtn);

      const caption = document.createElement("p");
      caption.className = "post-caption";
      caption.innerText = post.caption;

      container.append(header, media, actions, caption);
      feeder.appendChild(container);

      observer.observe(container); // Observe for visibility
    });

  } catch (err) {
    console.error("Post fetch failed:", err);
  }

  isLoading = false;
}

// Scroll loader
window.addEventListener("scroll", () => {
  if (isLoading || noMorePosts) return;

  const scrollPosition = window.innerHeight + window.scrollY;
  const pageHeight = document.body.offsetHeight;

  if (scrollPosition >= pageHeight - 300) {
    fetchFypPosts();
  }
});

// Start app
loadCurrentUser();
const reelsContainer = document.getElementById("reelsCon");
let CURRENT_USER_GOOGLE_ID = null;
let isLoading = false;
let noMorePosts = false;
let SEEN_REELS = new Set();

// Load viewer info
async function loadViewerId() {
  try {
    const res = await fetch("/api/user/me");
    const data = await res.json();
    CURRENT_USER_GOOGLE_ID = data.google_id;
    loadReels();
  } catch (err) {
    console.error("Error loading viewer:", err);
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

// Mark reel as seen
function markReelAsSeen(postId) {
  if (SEEN_REELS.has(postId)) return;
  SEEN_REELS.add(postId);

  fetch("/seen", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ google_id: CURRENT_USER_GOOGLE_ID, post_id: postId })
  });
}

// Observer
const observer = new IntersectionObserver((entries) => {
  let maxVisible = null;
  let maxRatio = 0;

  entries.forEach(entry => {
    if (entry.intersectionRatio > maxRatio) {
      maxRatio = entry.intersectionRatio;
      maxVisible = entry;
    }
  });

  if (!maxVisible) return;

  const container = maxVisible.target;
  const video = container.querySelector("video");
  const postId = container.dataset.postId;

  if (!video || !postId) return;

  if (maxRatio >= 0.6) {
    if (currentActiveVideo && currentActiveVideo !== video) {
      currentActiveVideo.pause();
    }

    if (video !== currentActiveVideo) {
      currentActiveVideo = video;

      video.play().then(() => {
        if (!SEEN_REELS.has(postId)) {
          SEEN_REELS.add(postId);
          console.log("✅ Seen:", postId);

          // Mark as seen on backend — only once per post
          fetch("/seen", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ google_id: CURRENT_USER_GOOGLE_ID, post_id: postId })
          }).then(res => {
            if (!res.ok) {
              console.warn("Failed to mark seen:", postId);
            }
          }).catch(console.error);
        }
      }).catch(err => console.warn("Autoplay error", err));
    }
  } else {
    video.pause();
  }
}, {
  threshold: Array.from({ length: 101 }, (_, i) => i / 100)
});

console.log("SEEN_REELS:", Array.from(SEEN_REELS));

// Load reels (video only)
async function loadReels() {
  if (isLoading || !CURRENT_USER_GOOGLE_ID || noMorePosts) return;
  isLoading = true;

  try {
    const res = await fetch(`/reels/batch?limit=4&viewerGoogleId=${CURRENT_USER_GOOGLE_ID}`);
    const posts = await res.json();

    if (posts.length === 0) {
      noMorePosts = true;
      console.log("🎞️ No more reels.");
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

      const video = document.createElement("video");
      video.src = post.video_url;
      video.className = "post-media";
      video.autoplay = true;
      video.loop = true;
      video.playsInline = true;
      video.preload = "auto";

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

      container.append(header, video, actions, caption);
      reelsContainer.appendChild(container);

      observer.observe(container);

      video.addEventListener("click", () => {
        if (video.paused) {
          video.play();
        } else {
          video.pause();
        }
      });
    });
  } catch (err) {
    console.error("Failed to load reels:", err);
  }

  isLoading = false;
}

// Infinite scroll
window.addEventListener("scroll", () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
    loadReels();
  }
});

// Init
window.addEventListener("DOMContentLoaded", async () => {
  await loadViewerId();
});
window.addEventListener("DOMContentLoaded", () => {
  const stats = document.getElementById("Stats");
  const main = document.getElementById("main");
  const overlay = document.createElement("div");
  const defaultPfp = 'https://static.vecteezy.com/system/resources/previews/036/280/651/large_2x/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg';
  overlay.id = "overlay";
  document.body.append(overlay);
  const postOutput = document.getElementById("PostOutput");

  const pp = document.createElement("img");
  pp.id = "pp";
  pp.setAttribute("data-modal-target", "#pp-modal");

  const ppWrapper = document.createElement("div");
  ppWrapper.className = "pp-wrapper";
  ppWrapper.appendChild(pp);
  stats.appendChild(ppWrapper);

  const ppModal = document.createElement("div");
  ppModal.id = "pp-modal";
  ppModal.className = "modal";
  document.body.append(ppModal);

  const Modalheader = document.createElement("div");
  Modalheader.id = "Modalheader";
  ppModal.appendChild(Modalheader);

  const ModalClose = document.createElement("button");
  ModalClose.id = "ModalCloseBtn";
  ModalClose.innerHTML = "&times;";
  Modalheader.append(ModalClose);
  ModalClose.setAttribute("data-close-button", "");

  const modalBody = document.createElement("div");
  modalBody.id = "modalB";
  ppModal.appendChild(modalBody);

  const ModalImg = document.createElement("img");
  ModalImg.id = "ModalImg";
  modalBody.appendChild(ModalImg);

  const openModalButtons = document.querySelectorAll('[data-modal-target]');
  const closeModalButtons = document.querySelectorAll('[data-close-button]');

  openModalButtons.forEach(button => {
    button.addEventListener('click', () => {
      const modal = document.querySelector(button.dataset.modalTarget);
      openModal(modal);
    });
  });

  overlay.addEventListener('click', () => {
    const modals = document.querySelectorAll('.modal.active');
    modals.forEach(modal => {
      closeModal(modal);
    });
  });

  closeModalButtons.forEach(button => {
    button.addEventListener('click', () => {
      const modal = button.closest('.modal');
      closeModal(modal);
    });
  });

  function openModal(modal) {
    if (modal == null) return;
    modal.classList.add('active');
    overlay.classList.add('active');
  }

  function closeModal(modal) {
    if (modal == null) return;
    modal.classList.remove('active');
    overlay.classList.remove('active');
  }

  const StatBar = document.createElement("div");
  const Postcon = document.createElement("div");
  const Followerscon = document.createElement("div");
  const Followingcon = document.createElement("div");

  const username = document.createElement("h2");
  const bio = document.createElement("h3");
  const Posts = document.createElement("h3");
  const posts = document.createElement("h3");
  const Followers = document.createElement("h3");
  const followers = document.createElement("h3");
  const Following = document.createElement("h3");
  const following = document.createElement("h3");
  const edit = document.createElement("button");
  const upload = document.createElement("button");

  stats.append(StatBar);
  stats.append(username);
  stats.append(bio);
  Postcon.appendChild(Posts);
  Postcon.appendChild(posts);
  Followerscon.appendChild(Followers);
  Followerscon.appendChild(followers);
  Followingcon.appendChild(Following);
  Followingcon.appendChild(following);
  StatBar.appendChild(Postcon);
  StatBar.appendChild(Followerscon);
  StatBar.appendChild(Followingcon);
  stats.append(edit);
  stats.append(upload);

  StatBar.id = "StatBar";
  username.id = "username";
  bio.id = "bio";
  Posts.id = "Posts";
  posts.id = "posts";
  Followers.id = "Followers";
  followers.id = "followers";
  Following.id = "Following";
  following.id = "following";
  edit.id = "edit";
  upload.id = "upload";

  Posts.textContent = "Posts:";
  Followers.textContent = "Followers:";
  Following.textContent = "Following:";
  edit.innerHTML = "<i class='bx bx-edit'>";
  upload.innerHTML = "<i class='bx bx-plus'></i>";

  const editMenu = document.createElement("div");
  const editMenuHeader = document.createElement("div");
  const editClose = document.createElement("button");

  editClose.innerHTML = "&times;";
  editMenu.id = "editMenu";
  editMenuHeader.id = "editMenuH";
  editClose.id = "editClose";

  editMenuHeader.appendChild(editClose);
  editMenu.appendChild(editMenuHeader);

  const uploadMenu = document.createElement("div");
  const uploadMenuHeader = document.createElement("div");
  const uploadClose = document.createElement("button");

  uploadClose.innerHTML = "&times;";
  uploadMenu.id = "uploadMenu";
  uploadMenuHeader.id = "uploadMenuH";
  uploadClose.id = "uploadClose";

  uploadMenuHeader.appendChild(uploadClose);
  uploadMenu.appendChild(uploadMenuHeader);

  const uploadForm = document.createElement("form");
  const fileInput = document.createElement("input");
  const customPicker = document.createElement("div");
  const OpenGalleryBtn = document.createElement("button");
  const previewContainer = document.createElement("div");
  const caption = document.createElement("input");
  const uploadSub = document.createElement("button");

  OpenGalleryBtn.innerText = "select posts";
  OpenGalleryBtn.type = "button";
  OpenGalleryBtn.onclick = () => fileInput.click();

  caption.type = "text";
  caption.id = "caption";
  caption.placeholder = "caption";

  uploadSub.type = "submit";
  uploadSub.id = "uploadSub";
  uploadSub.innerHTML = "<i class='bx bx-upload'></i>";

  fileInput.type = "file";
  fileInput.multiple = true;
  fileInput.accept = "image/*,video/*";
  fileInput.style = "display: none;";

  customPicker.className = "gallery";

  fileInput.id = "fileInput";
  customPicker.id = "customPicker";
  OpenGalleryBtn.id = "SelectImg";
  previewContainer.id = "previewContainer";

  customPicker.appendChild(OpenGalleryBtn);
  customPicker.appendChild(previewContainer);

  uploadForm.appendChild(fileInput);
  uploadForm.appendChild(customPicker);
  uploadForm.appendChild(caption);
  uploadForm.appendChild(uploadSub);
  uploadMenu.appendChild(uploadForm);

  const uploadLoader = document.createElement("div");
  uploadLoader.id = "uploadLoader";
  uploadLoader.innerHTML = `<div class="spinner"></div>`;
  uploadLoader.style.display = "none";
  uploadMenu.appendChild(uploadLoader);

  let selectedFiles = [];

  function renderPreviews() {
    previewContainer.innerHTML = "";

    selectedFiles.forEach((file, index) => {
      const previewItem = document.createElement("div");
      previewItem.classList.add("preview-item");

      const removeBtn = document.createElement("button");
      removeBtn.innerHTML = "&times;";
      removeBtn.classList.add("remove-btn");

      removeBtn.addEventListener("click", (e) => {
        e.stopPropagation(); // Prevent closing menu
        selectedFiles.splice(index, 1); // Remove only one item
        renderPreviews(); // Re-render previews
      });

      const fileURL = URL.createObjectURL(file);

      if (file.type.startsWith("image/")) {
        const img = document.createElement("img");
        img.src = fileURL;
        img.className = "preview-img";
        previewItem.appendChild(img);
      } else if (file.type.startsWith("video/")) {
        const video = document.createElement("video");
        video.src = fileURL;
        video.controls = true;
        video.className = "preview-video";
        previewItem.appendChild(video);
      }

      previewItem.appendChild(removeBtn);
      previewContainer.appendChild(previewItem);
    });
  }

  function clearUploadForm() {
    selectedFiles = [];
    fileInput.value = "";
    caption.value = "";
    previewContainer.innerHTML = "";
  }

  fileInput.addEventListener("change", () => {
    selectedFiles = Array.from(fileInput.files);
    renderPreviews();
  });

  uploadForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    uploadLoader.style.display = "flex";

    if (!selectedFiles.length) {
      alert("Please select at least one image or video.");
      uploadLoader.style.display = "none";
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach(file => formData.append("media", file));
    formData.append("caption", caption.value.trim());

    try {
      const res = await fetch("/posts/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        window.location.reload();
      } else {
        console.error(data.error || "Upload failed");
        alert("Upload failed.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("An error occurred during upload.");
    } finally {
      uploadLoader.style.display = "none";
    }
  });

  const editForm = document.createElement("form");
  const profilePicUpload = document.createElement("input");
  const profilePicU = document.createElement("img");
  const usernameUpload = document.createElement("input");
  const bioUpload = document.createElement("input");
  const confirmUpload = document.createElement("button");

  profilePicUpload.hidden = "hidden";
  profilePicUpload.type = "file";
  usernameUpload.type = "text";
  bioUpload.type = "text";
  confirmUpload.type = "submit";

  editForm.id = "profile-form";
  profilePicUpload.id = "profilePic";
  profilePicU.id = "custom-button";
  usernameUpload.id = "usernameUpload";
  bioUpload.id = "bioUpload";
  confirmUpload.id = "submit";

  usernameUpload.placeholder = "Username";
  bioUpload.placeholder = "Bio";
  confirmUpload.innerHTML = "Confirm";

  const customWrapper = document.createElement("div");
  customWrapper.className = "custom-wrapper";
  customWrapper.appendChild(profilePicU);

  editForm.appendChild(customWrapper);
  editForm.appendChild(profilePicUpload);
  editForm.appendChild(usernameUpload);
  editForm.appendChild(bioUpload);
  editForm.appendChild(confirmUpload);
  editMenu.appendChild(editForm);

  const loader = document.createElement("div");
  loader.id = "loader";
  loader.innerHTML = `<div class="spinner"></div>`;
  loader.style.display = "none";
  editMenu.appendChild(loader);

  profilePicUpload.addEventListener("change", () => {
    const file = profilePicUpload.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        profilePicU.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  editForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    loader.style.display = "flex";

    const file = profilePicUpload.files[0];
    const formData = new FormData();
    if (file) formData.append("profilePic", file);
    formData.append("username", usernameUpload.value);
    formData.append("bio", bioUpload.value);

    try {
      const res = await fetch("/profile/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();
      if (res.ok) {
        window.location.reload();
      } else {
        alert("❌ Error: " + data.message);
      }
    } catch (err) {
      console.error("💥 Upload failed:", err);
    } finally {
      loader.style.display = "none";
    }
  });

  profilePicU.addEventListener("click", function () {
    profilePicUpload.click();
  });

  main.appendChild(editMenu);
  main.appendChild(uploadMenu);

  edit.addEventListener("click", () => {
    editMenu.classList.add("active");
  });

  editClose.addEventListener("click", () => {
    editMenu.classList.remove("active");
  });

  upload.addEventListener("click", (e) => {
    e.stopPropagation();
    uploadMenu.classList.add("active");
  });

  uploadClose.addEventListener("click", () => {
    uploadMenu.classList.remove("active");
    clearUploadForm();
  });

  document.addEventListener("click", function (event) {
    const isClickInsideUpload = uploadMenu.contains(event.target);
    const isUploadBtn = event.target.closest("#upload");
    if (!isClickInsideUpload && !isUploadBtn) {
      uploadMenu.classList.remove("active");
      clearUploadForm();
    }
  });

  fetch("/api/user/profile")
    .then(res => res.json())
    .then(data => {
      username.textContent = data.username || "No username";
      bio.textContent = data.bio || "No bio";
      posts.textContent = data.posts || "0";
      followers.textContent = data.followers || "0";
      following.textContent = data.following || "0";

      const profilePic = data.profile_pic || defaultPfp;
      pp.src = profilePic;
      ModalImg.src = profilePic;
      profilePicU.src = profilePic;
    })
    .catch(err => {
      console.error("Failed to fetch user data", err);
    });

  async function loadUserPosts() {
    try {
      const res = await fetch("/posts/user-posts");
      const posts = await res.json();

      const postsContainer = document.getElementById("postsContainer");
      postsContainer.innerHTML = "";

      posts.forEach(post => {
        const postEl = document.createElement("div");
        postEl.className = "post";

        if (post.image_url) {
          const img = document.createElement("img");
          img.src = post.image_url;
          img.alt = "User post";
          postEl.appendChild(img);
        } else if (post.video_url) {
          const video = document.createElement("video");
          video.src = post.video_url;
          video.controls = true;
          postEl.appendChild(video);
        }

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delete-btn";
        deleteBtn.onclick = async () => {
          const confirmDelete = confirm("Are you sure you want to delete this post?");
          if (!confirmDelete) return;

          try {
            const delRes = await fetch(`/posts/delete/${post.id}`, {
              method: "DELETE",
            });

            if (delRes.ok) {
              postEl.remove();
              window.location.reload();
            } else {
              const delData = await delRes.json();
              alert("Delete failed: " + (delData.message || "Unknown error"));
            }
          } catch (error) {
            console.error("Delete error:", error);
            alert("Something went wrong while deleting.");
          }
        };

        postEl.appendChild(deleteBtn);
        postsContainer.appendChild(postEl);
      });

    } catch (err) {
      console.error("Error loading user posts:", err);
    }
  }

  loadUserPosts();
});
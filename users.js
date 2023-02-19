const buttons = document.querySelectorAll(".pagination__item");
const currentUrl = new URL(location);
const params = new URLSearchParams(currentUrl.search);

showUsers(params.get("page") || 1);
// setUrl(params.get("page") || 1);
setActiveButton(params.get("page") || 1);

function setUrl(pageNum) {
  const currentUrl = new URL(location);
  const params = new URLSearchParams(currentUrl.search);
  params.set("page", pageNum);
  params.set("per_Page", 2);
  currentUrl.search = params.toString();
  // history.pushState(
  //   {
  //     id: `${pageNum}`,
  //     source: "web",
  //   },
  //   pageNum,
  //   currentUrl.toString()
  // );
  localStorage.setItem("page", pageNum);
  location.href = currentUrl;
}

function showUsers(pageNum) {
  const usersList = document.querySelector(".js-users-list");
  const users = getUsers(pageNum);

  users.then((users) => {
    usersList.innerHTML = "";
    users.forEach((item) => {
      const user = document.createElement("li");
      user.classList.add("users__item", "user");
      user.setAttribute("data-id", item.id);
      let img;
      item.gender === "male" ? (img = "img/men.png") : (img = "img/women.png");
      user.innerHTML = `<div class="user__wrapper">
			<div class="user__img">
				<img src="${img}" alt="picture">
			</div>
			<div class="user__info">
				<p class="user__name">${item.name}</p>
				<p class="user__email">${item.email}</p>
			</div>
		</div>`;
      item.status === "active"
        ? user.classList.add("user--active")
        : user.classList.add("user--inactive");
      usersList.appendChild(user);
    });
  });
}

buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    showUsers(btn.getAttribute("data-page"));
    setUrl(btn.getAttribute("data-page"));
  });
});

function setActiveButton(pageNum) {
  buttons.forEach((item) => {
    item.classList.remove("pagination__item--active");
    const activeButton = document.querySelector(
      "[data-page='" + pageNum + "']"
    );
    activeButton.classList.add("pagination__item--active");
  });
}

async function getUsers(pageNum) {
  const url = `https://gorest.co.in/public/v2/users?page=${pageNum}&per_page=2`;
  const response = await fetch(url);
  return response.json();
}

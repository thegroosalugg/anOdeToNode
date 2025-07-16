let token;
let itemId;

const showModal = (className) => document.querySelector(className).showModal();

const openModal = (csrf, _id) => {
  token  = csrf;
  itemId = _id;
  showModal(".modal-confirm");
};

const closeModal = (className) => {
  const modal = document.querySelector(className);
  modal.setAttribute("closing", "");
  modal.addEventListener(
    "animationend",
    () => {
      modal.removeAttribute("closing");
      modal.close();
    },
    { once: true }
  );
};

const deleteItem = async () => {
  try {
    const response = await fetch("/admin/item/" + itemId, {
       method: "DELETE",
      headers: {
        "x-csrf-token": token,
                Accept: "application/json", // indicates its a fetch request
      },
    });

    if (!response.ok) {
      showModal(".modal-error");
      return;
    }

    document.getElementById(itemId).remove();
    closeModal(".modal-confirm");
  } catch (error) {
    showModal(".modal-error");
  }
};

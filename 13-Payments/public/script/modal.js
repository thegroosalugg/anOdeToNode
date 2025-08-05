const showModal = (query) => document.querySelector(query).showModal();

const closeModal = (query) => {
  const modal = document.querySelector(query);
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

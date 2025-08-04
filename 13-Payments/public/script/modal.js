const showModal = (className) => document.querySelector(className).showModal();

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

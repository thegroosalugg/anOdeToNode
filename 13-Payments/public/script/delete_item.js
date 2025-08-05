let token;
let itemId;

// **must run modal.js with this script
const confirmDeletion = (csrf, _id) => {
  token  = csrf;
  itemId = _id;
  showModal("#modal-delete");
};

const deleteItem = async () => {
  const error = () => showModal("#modal-error");

  try {
    const response = await fetch("/admin/item/" + itemId, {
       method: "DELETE",
      headers: {
                Accept: "application/json", // indicates its a fetch request
        "x-csrf-token": token,
      },
    });

    if (!response.ok) {
      error();
      return;
    }

    document.getElementById(itemId).remove();
  } catch (error) {
    console.log("deleteItem error", error);
    error();
  } finally {
    closeModal("#modal-delete");
  }
};

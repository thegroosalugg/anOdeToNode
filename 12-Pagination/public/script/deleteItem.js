const deleteItem = async (csrf, itemId) => {
  try {
    const response = await fetch('/admin/item/' + itemId, {
      method: 'DELETE',
      headers: {
        'x-csrf-token': csrf,
              'Accept': 'application/json' // indicates its a fetch request
      }
    });

    if (!response.ok) {
      document.querySelector('.modal-error').showModal();
      return;
    }

    document.getElementById(itemId).remove();
  } catch (error) {
    document.querySelector('.modal-error').showModal();
  }
}

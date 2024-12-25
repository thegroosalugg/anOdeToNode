const deleteItem = async (btn) => {
  const confirmed = window.confirm('Are you sure you want to delete this item?');

  if (!confirmed) {
    return;
  }
  // parent HTML required to query siblings. Use [] to find an element via props
  const csrf   = btn.parentNode.querySelector('[name=_csrf]').value;
  const itemId = btn.parentNode.querySelector('[name=itemId]').value;

  try {
    const response = await fetch('/admin/item/' + itemId, {
      method: 'DELETE',
      headers: {
        'x-csrf-token': csrf,
        'Accept': 'application/json' // indicates its a fetch request
      }
    });

    if (!response.ok) {
      return window.alert('Looks like an error occured!')
    }
    // delete LI from DOM
    btn.parentNode.parentNode.remove();
  } catch (error) {
    window.alert(error.message);
  }
}

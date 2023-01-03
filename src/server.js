export const rationApi = (id) => {
  if (id) {
    return `http://localhost:5000/ration/${id}`;
  } else {
    return `http://localhost:5000/ration`;
  }
};

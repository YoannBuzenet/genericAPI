function getHeaders(form) {
  return new Promise((resolve, reject) => {
    form.getLength((err, length) => {
      if (err) {
        reject(err);
      }
      let headers = Object.assign(
        { "Content-Length": length },
        form.getHeaders()
      );
      resolve(headers);
    });
  });
}

module.exports = { getHeaders };

import { ElMessage } from "element-plus";

const getBlob = (url, requestType = "GET") => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(requestType, url, true);
    xhr.responseType = "blob";
    xhr.setRequestHeader("Cache-Control", "no-cache");
    xhr.onload = () => {
      console.log("xhr", xhr);
      if (xhr.status === 200) {
        resolve(xhr.response);
      } else {
        reject(xhr);
      }
    };
    xhr.send();
  });
};
/**
 * 保存 blob
 * filename 想要保存的文件名称
 */
const saveAs = (blob, filename) => {
  const navigator = window.navigator;
  if (navigator.msSaveOrOpenBlob) {
    navigator.msSaveBlob(blob, filename);
  } else {
    const link = document.createElement("a");
    const body= document.querySelector("body");
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    // fix Firefox
    link.style.display = "none";
    body.appendChild(link);
    link.click();
    body.removeChild(link);
    window.URL.revokeObjectURL(link.href);
  }
};
/**
 * 下载
 * @param  {String} url 目标文件地址
 * @param  {String} filename 想要保存的文件名称
 */
const downloadFile = async (
  url,
  filename,
  requestType = "GET"
) => {

  return getBlob(url, requestType)
    .then((blob) => {
      saveAs(blob, filename);
      return Promise.resolve();
    })
    .catch((err) => {
      ElMessage({
        message: err?.message || "网络异常，请稍后再试",
        type: "error",
      });
      return Promise.reject(err);
    })
    .finally(() => {

    });
};

export default downloadFile;

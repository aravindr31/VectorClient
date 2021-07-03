import axios from "axios";
import prettyBytes from "pretty-bytes";
import editorSetups from "./editorSetup";

const headerContainer = document.querySelector("[data-header]");
const paramsContainer = document.querySelector("[data-params]");
const templateContainer = document.querySelector("[data-key-value-template]");
const form = document.querySelector("[data-form]");
const responseHeaderContainer = document.querySelector(
  "[data-response-header]"
);
const ToastNotification = document.getElementById("errorToast");
const bootstarpToastOption = {
  animation: true,
  delay: 2500,
};

const keyValuePair = () => {
  const template = templateContainer.content.cloneNode(true);
  template
    .getElementById("remove-key-value")
    .addEventListener("click", (event) => {
      event.target.closest("[data-key-value-pair]").remove();
    });
  return template;
};

const createKeyValueObject = (container) => {
  const keyValues = container.querySelectorAll("[data-key-value-pair]");
  return [...keyValues].reduce((data, keyValue) => {
    const key = keyValue.getElementById("key").value;
    const value = keyValue.getElementById("value").value;

    if (key === "") return data;

    return { ...data, [key]: value };
  });
};

const updateHeaders = (responseHeader) => {
  responseHeaderContainer.innerHTML = "";
  Object.entries(responseHeader).forEach(([key, value]) => {
    const keyDiv = document.createElement("div");
    keyDiv.textContent = key;
    responseHeaderContainer.append(keyDiv);
    const valDiv = document.createElement("div");
    valDiv.textContent = value;
    responseHeaderContainer.append(valDiv);
  });
};
const updateElements = (response) => {
  console.log(response);
  document.querySelector("[data-status]").innerHTML = response.status;
  document.querySelector("[data-time]").innerHTML = response.addtionalData.time;
  document.querySelector("[data-size]").innerHTML = prettyBytes(
    JSON.stringify(response.headers).length +
      JSON.stringify(response.data).length
  );
};

const getEndTime = (response) => {
  response.addtionalData = response.addtionalData || {};
  response.addtionalData.time =
    new Date().getTime() - response.config.addtionalData.startTime;
  return response;
};

axios.interceptors.request.use((request) => {
  request.addtionalData = request.addtionalData || {};
  request.addtionalData.startTime = new Date().getTime();
  return request;
});
axios.interceptors.response.use(getEndTime, (error) => {
  return Promise.reject(getEndTime(error.response));
});

const { requestEditor, updateResponse } = editorSetups();

form.addEventListener("submit", (e) => {
  e.preventDefault();

  let data;
  try {
    data = JSON.parse(requestEditor.state.doc.toString() || null);
    console.log(body);
  } catch (err) {
    let toastElement = new bootstrap.Toast(
      ToastNotification,
      bootstarpToastOption
    );
    toastElement.show();
    return;
  }

  axios({
    url: document.querySelector("[data-url]").value,
    method: document.querySelector("[data-method]").value,
    headers: createKeyValueObject(headerContainer),
    params: createKeyValueObject(paramsContainer),
    data,
  })
    .catch((err) => err)
    .then((response) => {
      document.querySelector("[data-response]").classList.remove("d-none");
      updateElements(response);
      updateResponse(response.data);
      updateHeaders(response.headers);
    });
});

document.getElementById("data-add-header").addEventListener("click", () => {
  headerContainer.append(keyValuePair());
});

document.getElementById("data-add-params").addEventListener("click", () => {
  paramsContainer.append(keyValuePair());
});

headerContainer.append(keyValuePair());
paramsContainer.append(keyValuePair());

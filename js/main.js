let url = "";
$(document).ready(() => {
  $("#sendBtn").click(() => {
    document.getElementById("selectedFile").click();
  });
  $("html").on("dragover", function (event) {
    event.preventDefault();
    event.stopPropagation();
    $(this).addClass("dragging");
  });

  $("html").on("dragleave", function (event) {
    event.preventDefault();
    event.stopPropagation();
    $(this).removeClass("dragging");
  });
  function FileListItems(files) {
    var b = new ClipboardEvent("").clipboardData || new DataTransfer();
    for (var i = 0, len = files.length; i < len; i++) b.items.add(files[i]);
    return b.files;
  }
  document.body.ondrop = function (event) {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.items) {
      // Use a interface DataTransferItemList para acessar o (s) arquivo (s)
      for (var i = 0; i < event.dataTransfer.items.length; i++) {
        if (event.dataTransfer.items[i].kind === "file") {
          if (i == 0) {
            var file = event.dataTransfer.items[i].getAsFile();
            $("input[type='file']").prop("files", FileListItems([file]));
            uploadFile();
          }
        }
      }
    }
  };

  let uploadFile = () => {
    if (document.getElementById("selectedFile").files[0]) {
      let formData = new FormData();
      formData.append("file", document.getElementById("selectedFile").files[0]);
      axios
        .request({
          method: "post",
          url: "https://api.anonfiles.com/upload",
          data: formData,
          onUploadProgress: (p) => {
            $("#sendBtn").text(
              "Uploading..." + ` ${Math.round((p.loaded / p.total) * 100)}%`
            );
          },
        })
        .then((data) => {
          if (data.status == 200) {
            let result = data.data;
            if (result.status == true) {
              $("#sendBtn").text("Uploaded " + result.data.file.metadata.name);
              $("#sendBtn").prop("disabled", true);
              document.getElementById("alertResult").hidden = false;
              $("#renderedString-result").html(`Upload is complete
                        <a href="${result.data.file.url.short}" target="_blank" class="alert-link">click here to open page</a>. Or
                         <a id="copyToClipboard" class="alert-link cursorPointer">Copy to clipboard</a>`);
              $("#copyToClipboard").click(() => {
                navigator.clipboard.writeText(result.data.file.url.short).then(
                  () => {
                    alert("Url copied to clipboard");
                  },
                  () => {
                    alert("Error on copy url to clipboard");
                  }
                );
              });
            }
          }
        });
    }
  };
  $("#selectedFile").change(() => {
    uploadFile();
  });
});

$(document).ready(() => {
  display();
});

$(document).on("input", "input, textarea", function () {
  $(this).removeClass("is-invalid");
});

$("#fileInput").change((e) => {
  var file = e.target.files[0];
  var imageType = /image.*/;

  if (file.type.match(imageType)) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      $("#fileName").html(file.name);
      $("#displayArea").html("");
      var img = new Image();
      img.src = reader.result;
      $(img).addClass("img-fluid");
      $("#displayArea").append(img);
    };
  } else {
    $("#invalidFile").html("This file is not supported.");
    $("#fileInput").addClass("is-invalid");
  }
});

function display() {
  if (localStorage.getItem("listOfAllRecipes") === null) return;
  $("#tableContainer").css("display", "block");
  var listOfAllRecipes = JSON.parse(localStorage.getItem("listOfAllRecipes"));
  var tableBody = "";
  for (var i in listOfAllRecipes) {
    tableBody += `<tr>
                        <td>${listOfAllRecipes[i].recipeName}</td>
                        <td>${listOfAllRecipes[i].instructions}</td>
                        <td>${listOfAllRecipes[i].cookTime}</td>
                        <td style="width:25%;">
                          <img src="${listOfAllRecipes[i].recipeImageURL}" class="img-fluid" style="width:100%;display:block;">
                        </td>
                      </tr>`;
  }
  $("#tbody").html(tableBody);
}

$("#submitRecipe").click(() => {
  var recipeName = $("#recipeName");
  var existingRecipeName;
  var instructions = $("#instructions");
  var cookTime = $("#cookTime");
  var recipeImage = $("#fileInput");
  var recipeInfo = {
    recipeName: recipeName.val().trim(),
    instructions: instructions.val(),
    cookTime: cookTime.val().trim(),
  };

  if (localStorage.getItem("listOfAllRecipes") !== null)
    var listOfAllRecipes = JSON.parse(localStorage.getItem("listOfAllRecipes"));
  else var listOfAllRecipes = [];

  if (!recipeName[0].checkValidity()) recipeName.addClass("is-invalid");

  if (!instructions[0].checkValidity()) instructions.addClass("is-invalid");

  if (!cookTime[0].checkValidity()) cookTime.addClass("is-invalid");

  if (!recipeImage[0].checkValidity()) recipeImage.addClass("is-invalid");

  for (var i in listOfAllRecipes) {
    if (recipeName.val().trim() == listOfAllRecipes[i].recipeName) {
      recipeName.addClass("is-invalid");
      $("#invalidRecipeName").html(
        "This recipe name is already being used. Please choose another one."
      );
      return;
    }
  }
  if (
    recipeName[0].checkValidity() &&
    instructions[0].checkValidity() &&
    cookTime[0].checkValidity() &&
    recipeImage[0].checkValidity()
  ) {
    var file = recipeImage[0].files[0];
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      var recipeImageURL = reader.result;
      recipeInfo.recipeImageURL = recipeImageURL;
      listOfAllRecipes.push(recipeInfo);
      localStorage.setItem(
        "listOfAllRecipes",
        JSON.stringify(listOfAllRecipes)
      );
      display();
    };
  }
});

$("#newRecipe").click(() => {
  $("#displayArea").html("");
  $("input, textarea").removeClass("is-invalid");
  $("#fileName").html("Choose file");
});

$("#showRecipes").click(() => {
  $("#tableContainer").toggle();
});

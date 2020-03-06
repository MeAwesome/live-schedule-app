try{
  if(getTheme() == "dark"){
    document.documentElement.setAttribute('data-theme', 'dark');
    document.getElementById("themeSlider").checked = true;
  } else {
      document.documentElement.setAttribute('data-theme', 'light');
      document.getElementById("themeSlider").checked = false;
  }
} catch {

}

function onLoadCheckTheme(){
  try{
    if(getTheme() == "dark"){
      document.documentElement.setAttribute('data-theme', 'dark');
      document.getElementById("themeSlider").checked = true;
      fgColorCircle = "#FFFFFF";
      bgColorCircle = "#6698FF";
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        document.getElementById("themeSlider").checked = false;
        fgColorCircle = "#6698FF";
        bgColorCircle = "#000000";
    }
  } catch {

  }
}

function switchTheme() {
if (document.getElementById("themeSlider").checked) {
  document.documentElement.setAttribute('data-theme', 'dark');
  fgColorCircle = "#FFFFFF";
  bgColorCircle = "#6698FF";
  setTheme("dark");
}
else {
  document.documentElement.setAttribute('data-theme', 'light');
  fgColorCircle = "#6698FF";
  bgColorCircle = "#000000";
  setTheme("light");
}
}

import autoprefixer from "autoprefixer";
import precss from "precss";
import normalize from "postcss-normalize";

export default {
  plugins: [precss, autoprefixer, normalize],
};

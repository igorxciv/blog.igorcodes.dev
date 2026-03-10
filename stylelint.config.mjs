/** @type {import("stylelint").Config} */
const config = {
  extends: ["stylelint-config-standard"],
  plugins: ["stylelint-order"],
  rules: {
    "alpha-value-notation": "number",
    "at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: [
          "theme",
          "utility",
          "custom-variant",
          "variant",
          "plugin",
          "source",
          "reference",
        ],
      },
    ],
    "color-function-notation": "modern",
    "declaration-no-important": true,
    "function-url-quotes": "always",
    "hue-degree-notation": "angle",
    "import-notation": null,
    "length-zero-no-unit": true,
    "max-nesting-depth": 2,
    "no-descending-specificity": null,
    "number-max-precision": 4,
    "order/order": ["custom-properties", "declarations"],
    "rule-empty-line-before": [
      "always-multi-line",
      {
        except: ["first-nested"],
        ignore: ["after-comment"],
      },
    ],
    "selector-max-id": 0,
    "selector-pseudo-element-colon-notation": "double",
    "shorthand-property-no-redundant-values": true,
    "value-keyword-case": "lower",
  },
};

export default config;

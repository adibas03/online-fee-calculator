let fees = [];
let gross = 0;
let result = 0;

const GrossElement = "gross";
const FeeElement = "fees";
const NetElement = "net";
const FeeAdderElement = "feeAdderElement";
const TotalFeesElement = "totalFees";
const NetAmontElement = "final";

const generateElement = (type) => {
  return document.createElement(type);
};

const getElement = (condition = {}) => {
  return condition.id
    ? document.getElementById(condition.id)
    : condition.class
    ? document.getElementsByClassName(condition.class)
    : condition.tag
    ? document.getElementsByTagName(condition.tag)
    : condition.name
    ? document.getElementsByName(condition.name)
    : null;
};

const trackInput = (element, func) => {
  element.onchange = func;
  element.onkeyup = func;
};

const trackGrossInput = (element) => {
  element.value = gross;

  trackInput(element, (ev) => {
    const value = ev.target.value;
    gross = value;
    updateAllPercentageFees();
    updateValues();
  });
};

const trackFeeInput = (element, index) => {
  fees[index] = 0;
  element.value = 0;
  updateValues();

  trackInput(element, (ev) => {
    const value = ev.target.value;
    fees[index] = value;
    getElement({ id: `fees_percentage_${index}` }).value = "";
    updateValues();
  });
};

const trackFeePercentageInput = (element, index) => {
  trackInput(element, (ev) => {
    const value = ev.target.value;
    updatePercentageFees(index, value);
  });
};

const updatePercentageFees = (index, value) => {
  fees[index] = (Number(value) / 100) * Number(gross);
  getElement({ id: `fees_${index}` }).value = fees[index];
  updateValues();
};

const updateAllPercentageFees = () => {
  const percentage_inputs = getElement({ class: "fees_percentage_input" });
  for (let i = 0; i < percentage_inputs.length; i++) {
    if (Number(percentage_inputs[i].value) !== 0) {
      updatePercentageFees(i, percentage_inputs[i].value);
    }
  }
};

const totalFees = () => fees.reduce((a, b) => Number(a) + Number(b), 0);
const netValue = () => Number(gross) - Number(totalFees());

const addFee = () => {
  const id = `fees_${fees.length}`;
  const pId = `fees_percentage_${fees.length}`;
  const p = generateElement("p");
  const input = generateElement("input");
  const pInput = generateElement("input");
  input.id = id;
  pInput.id = pId;
  input.className = `fees_input`;
  pInput.className = `fees_percentage_input`;
  pInput.placeholder = "Fee as percentage of Gross";
  trackFeePercentageInput(pInput, fees.length);
  trackFeeInput(input, fees.length);
  p.appendChild(input);
  p.appendChild(pInput);
  getElement({ id: FeeElement }).appendChild(p);
};

const addGross = () => {
  const id = `${GrossElement}_input`;
  const input = generateElement("input");
  input.id = id;
  trackGrossInput(input);
  getElement({ id: GrossElement }).appendChild(input);
};

const updateValues = () => {
  getElement({ id: TotalFeesElement }).textContent = totalFees();

  const NegativeNetClass = "negativeNet";
  const netElement = getElement({ id: NetAmontElement });
  const finalValue = netValue();
  netElement.textContent = finalValue;
  if (finalValue < 0) {
    netElement.className = netElement.className
      ? netElement.className + NegativeNetClass
      : NegativeNetClass;
  } else {
    netElement.className = (netElement.className || "").replace(
      new RegExp(NegativeNetClass, "g"),
      ""
    );
  }
};

window.onload = () => {
  getElement({ id: FeeAdderElement }).addEventListener("click", addFee);
  updateValues();
  addGross();
  addFee();
};

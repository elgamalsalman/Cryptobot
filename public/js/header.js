const origin = window.location.origin;

const baseInput = document.querySelector(".base-input");
const quoteInput = document.querySelector(".quote-input");

baseInput.value = window.global.base;
quoteInput.value = window.global.quote;
const updateSymbol = () => {
	const newBase = baseInput.value;
	const newQuote = quoteInput.value;
	window.location.replace(`${origin}/charts?base=${newBase}&quote=${newQuote}`);
};
baseInput.onchange = updateSymbol;
quoteInput.onchange = updateSymbol;
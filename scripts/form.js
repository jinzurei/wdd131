// Product array for select field
const products = [
	{ id: 'widget', name: 'Widget' },
	{ id: 'gadget', name: 'Gadget' },
	{ id: 'doohickey', name: 'Doohickey' },
	{ id: 'thingamajig', name: 'Thingamajig' },
	{ id: 'contraption', name: 'Contraption' }
];

document.addEventListener('DOMContentLoaded', function() {
	const select = document.getElementById('productName');
	if (select) {
		products.forEach(product => {
			const option = document.createElement('option');
			option.value = product.id;
			option.textContent = product.name;
			select.appendChild(option);
		});
	}
});

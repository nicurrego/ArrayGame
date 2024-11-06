/*
Level 1:

task: create an array and insert items in it.
*/
console.log("Level 1---")
let mochila = [];
console.log("Created an empty mochila:", mochila);

// Prepare items to insert into the mochila
let item1 = "manzana";
let item2 = "agua";

// Insert items
mochila.push(item1);
mochila.push(item2);

console.log("After inserting items:", mochila);

/*
Level 2:

task: remove items from the array using pop() and shift()
*/
console.log("Level 2---")

console.log("Before removing items:", mochila);

// Remove the last item (agua)
let itemRemoved = mochila.pop();
console.log(`Removed item (from end): ${itemRemoved}`);
console.log("After pop:", mochila);

// Add a few more items for the next step
let item3 = "linterna";
let item4 = "mapa";
mochila.push(item3);
mochila.push(item4);
console.log("After adding more items:", mochila);

// Remove the first item (manzana)
itemRemoved = mochila.shift();
console.log(`Removed item (from start): ${itemRemoved}`);
console.log("After shift:", mochila);

/*
Level 3:

task: access an item using its index.
*/
console.log("Level 3---")
console.log("Current items in mochila:", mochila);

// Prepare the index to access
let indexToAccess = 0;

// Accessing an item by index (getting 'linterna')
let itemAccessed = mochila[indexToAccess];
console.log(`Accessed item at index ${indexToAccess}: ${itemAccessed}`);

/*
Level 4:

task: check if a specific item exists in the array using includes() or find its index with indexOf()
*/
console.log("Level 4---")
// Prepare the item to search
let itemToCheck = "mapa";

// Check if "mapa" is in mochila
let hasMap = mochila.includes(itemToCheck);
console.log(`Does mochila contain '${itemToCheck}'?: ${hasMap}`);

// Find index of 'mapa'
let indexOfMap = mochila.indexOf(itemToCheck);
console.log(`Index of '${itemToCheck}': ${indexOfMap}`);

/*
Level 5:

task: add an item to the beginning using unshift() and remove an item by its index using splice()
*/
console.log("Level 5---")
// Prepare the item to add to the beginning
let itemToAdd = "brújula";

// Add an item to the beginning
mochila.unshift(itemToAdd);
console.log("After unshift (adding 'brújula'):", mochila);

// Prepare the index to remove
let indexToRemove = 1;

// Remove an item by its index (removing 'linterna')
mochila.splice(indexToRemove, 1); // Remove 1 item at index 1
console.log(`After removing item at index ${indexToRemove} (linterna):`, mochila);

/*
Level 6:

task: sort the array in alphabetical order using sort()
*/
console.log("Level 6---")
// Prepare items to add
let item5 = "tienda";
let item6 = "comida";
mochila.push(item5);
mochila.push(item6);
console.log("Before sorting:", mochila);

// Sort the items in the array
mochila.sort();
console.log("After sorting:", mochila);

/*
Level 7:

task: filter the array items to include only items that start with 'b'
*/
console.log("Level 7---")
// Filtering items that start with 'b'
let itemsStartingWithB = mochila.filter(item => item.startsWith('b'));
console.log("Items starting with 'b':", itemsStartingWithB);

/*
Level 8:

task: use map() to modify each item, appending '-Arry's Item' to each
*/
console.log("Level 8---")
// Modifying each item with map()
let modifiedItems = mochila.map(item => `${item}-Arry's Item`);
console.log("Modified items:", modifiedItems);//aqui se busca hacer un nuevo array en lugar de modificarlo.

/*
Level 9:

task: iterate over the array and log each item with its index using forEach()
*/
console.log("Level 9---")
// Iterating with forEach
mochila.forEach((item, index) => {
    console.log(`Item at index ${index}: ${item}`); // agregar la modificacion de los parametros como conjunto para que entiendan que estos no son terminos predeterminados, pero si valores a los cuales se les puede cambiar el nombre.
});

/*
Level 10:

task: concatenate two arrays and destructure the resulting array
*/
console.log("Level 10---")
// Prepare extra items array
let extraItems = ["linterna", "mochila extra"];

// Concatenate arrays
let combinedMochila = mochila.concat(extraItems);
console.log("Combined array:", combinedMochila);

// Destructure combined array
let [firstItem, secondItem, ...remainingItems] = combinedMochila;
console.log(`First item: ${firstItem}`);
console.log(`Second item: ${secondItem}`);
console.log("Remaining items:", remainingItems);

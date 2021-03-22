this app is modelling the product lifecycle from an online shop`s perspective.
the app has 3 parts: the store, the online shop and the shopping cart.
the store: this is the background storage. It`s inventory reflects what kind of
products are in stock and whick item is out of stock. The user can use the +/-
buttons to alter the available amount for every product.
the webshop contains all the products the company currently posesses (every intem where
the onStock property >0. Those items that out of stock are not visible in the store.
Any item is clicked will end up in the shopping cart.
If the user clicks on proceeede payment button, the shopping cart will be empty and the
purchased items will be deducted from the stock.
There is an axios get request happening at the first load, requesting EUR/HUF exchange
rate from an online server. We nned this rate to give information about the total payable
in EUR and in HUF as well.

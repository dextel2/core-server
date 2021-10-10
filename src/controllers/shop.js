import Product from "../models/product";

export const getProducts = (req, res, next) => {
	Product.fetchAll()
		.then((products) => {
			res.render("shop/product-list", {
				prods: products,
				pageTitle: "All Products",
				path: "/products",
			});
		})
		.catch((err) => {
			console.log(err);
		});
};

export const getProduct = (req, res, next) => {
	const prodId = req.params.productId;
	Product.findById(prodId)
		.then((product) => {
			res.render("shop/product-detail", {
				product: product,
				pageTitle: product.title,
				path: "/products",
			});
		})
		.catch((err) => console.log(err));
};

export const getIndex = (req, res, next) => {
	Product.fetchAll()
		.then((products) => {
			res.render("shop/index", {
				prods: products,
				pageTitle: "Shop",
				path: "/",
			});
		})
		.catch((err) => {
			console.log(err);
		});
};

export const getCart = (req, res, next) => {
	req.user
		.getCart()
		.then((products) => {
			res.render("shop/cart", {
				path: "/cart",
				pageTitle: "Your Cart",
				products,
			});
		})
		.catch((err) => console.log(err));
};

export const postCart = (req, res, next) => {
	const prodId = req.body.productId;
	console.log(req.user);
	Product.findById(prodId)
		.then((product) => {
			return req.user.addToCart(product);
		})
		.then((result) => {
			console.log(result);
		});
};

export const postCartDeleteProduct = (req, res, next) => {
	const prodId = req.body.productId;
	req.user
		.getCart()
		.then((cart) => {
			return cart.getProducts({ where: { id: prodId } });
		})
		.then((products) => {
			const product = products[0];
			return product.cartItem.destroy();
		})
		.then((result) => {
			res.redirect("/cart");
		})
		.catch((err) => console.log(err));
};

export const postOrder = (req, res, next) => {
	let fetchedCart;
	req.user
		.getCart()
		.then((cart) => {
			fetchedCart = cart;
			return cart.getProducts();
		})
		.then((products) => {
			return req.user
				.createOrder()
				.then((order) => {
					return order.addProducts(
						products.map((product) => {
							product.orderItem = { quantity: product.cartItem.quantity };
							return product;
						})
					);
				})
				.catch((err) => console.log(err));
		})
		.then((result) => {
			return fetchedCart.setProducts(null);
		})
		.then((result) => {
			res.redirect("/orders");
		})
		.catch((err) => console.log(err));
};

export const getOrders = (req, res, next) => {
	req.user
		.getOrders({ include: ["products"] })
		.then((orders) => {
			res.render("shop/orders", {
				path: "/orders",
				pageTitle: "Your Orders",
				orders: orders,
			});
		})
		.catch((err) => console.log(err));
};

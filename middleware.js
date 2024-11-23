export const isAuthenticated = (req, res, next) => {
	if (req.session?.user) {
		return next();
	}
	return res.redirect("/");
};

export const isAuthorizer = (req, res, next) => {
	const roles = ["advisor", "staff", "instructor", "dean"];
	if (roles.includes(req.session.user.role)) {
		return next();
	}
	return res.status(403).json({ message: "User is not a petition authorizer" });
};

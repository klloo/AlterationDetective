const AlterationShopQuery = {
    selectAlterationShopList: "SELECT"
    + " alteration_shop_name as alterationShopName,"
	+ " address,"
	+ " latitude,"
	+ " longitude,"
	+ " phone_number as phone_number"
    + " FROM"
	+ " alteration_shop",
}

module.exports = AlterationShopQuery;
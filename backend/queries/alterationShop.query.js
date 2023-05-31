const AlterationShopQuery = {
    selectAlterationShopList: `
		SELECT
			a.alteration_shop_id as alterationShopId,
			alteration_shop_name as alterationShopName,
			address,
			latitude,
			longitude,
			a.image,
			ST_DISTANCE_SPHERE(POINT(?, ?), location) AS mapDist,
			ST_DISTANCE_SPHERE(POINT(?, ?), location) AS dist,
			phone_number as phoneNumber,
			IFNULL(AVG(r.star_rate),0) as starRate,
			COUNT(DISTINCT r.review_id) as reviewCount,
			COUNT(DISTINCT l.user_id) as likeCount,
			IF(ul.user_id is null, false, true) as likeFlag
		FROM
			alteration_shop a
		LEFT JOIN 
			review r 
			ON r.alteration_shop_id = a.alteration_shop_id
		LEFT JOIN
			shop_like l 
			ON l.alteration_shop_id = a.alteration_shop_id
		LEFT JOIN 
			shop_like ul
			ON ul.alteration_shop_id = a.alteration_shop_id
			AND ul.user_id = ?
		GROUP BY
			alterationShopId
		ORDER BY 
			dist
	`,
    selectAlterationShopDetailInfo: `
		SELECT
			alteration_shop_name as alterationShopName,
			address,
			latitude,
			longitude,
			a.image,
			ST_DISTANCE_SPHERE(POINT(?, ?), location) AS dist,
			phone_number as phoneNumber,
			IFNULL(AVG(r.star_rate),0) as starRate,
			COUNT(DISTINCT r.review_id) as reviewCount,
			IF(ul.user_id is null, false, true) as likeFlag
		FROM
			alteration_shop a
		LEFT JOIN 
			review r 
			ON r.alteration_shop_id = a.alteration_shop_id
		LEFT JOIN
			shop_like l 
			ON l.alteration_shop_id = a.alteration_shop_id
		LEFT JOIN 
			shop_like ul
			ON ul.alteration_shop_id = a.alteration_shop_id
			AND ul.user_id = ?
		WHERE 
			a.alteration_shop_id = ?
	`,
}

module.exports = AlterationShopQuery;
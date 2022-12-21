const AlterationShopQuery = {
    selectAlterationShopList: `
		SELECT
			a.alteration_shop_id as alterationShopId,
			alteration_shop_name as alterationShopName,
			address,
			latitude,
			longitude,
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
			ST_DISTANCE_SPHERE(POINT(?, ?), location) AS dist,
			phone_number as phoneNumber,
			review.starRate,
			review.reviewCount,
			review.likeCount,
			IF(ul.user_id is null, false, true) as likeFlag,
			tag.tag_id as tagId,
			tag.tag_name as tagName
		FROM
			alteration_shop a
		LEFT JOIN (
				SELECT
					r.alteration_shop_id,
					AVG(r.star_rate) as starRate,
					COUNT(DISTINCT r.review_id) as reviewCount,
					COUNT(DISTINCT l.user_id) as likeCount
				FROM 
					alteration_shop a 
				LEFT JOIN 
					review r 
					ON r.alteration_shop_id = a.alteration_shop_id
				LEFT JOIN
					shop_like l 
					ON l.alteration_shop_id = a.alteration_shop_id
			) review
			ON review.alteration_shop_id = a.alteration_shop_id
		LEFT JOIN
			tag_alteration_shop_mapping m
			ON m.alteration_shop_id = a.alteration_shop_id
		LEFT JOIN 
			tag 
			ON m.tag_id = tag.tag_id
		LEFT JOIN 
			shop_like ul
			ON ul.alteration_shop_id = a.alteration_shop_id
			AND ul.user_id = ?
		WHERE 
			a.alteration_shop_id = ?
	`,
	selectTagList: `
		SELECT
			tag_id as tagId,
			tag_name as tagName
		FROM
			tag
	`,
	selectLikeCount: `
		SELECT
			COUNT(*) as count
		FROM
			shop_like 
		WHERE
			alteration_shop_id = ?
			AND
			user_id = ?
	`,
	insertLike: `
		INSERT INTO shop_like (alteration_shop_id, user_id) VALUES (?, ?)
	`,
	deleteLike: `
		DELETE FROM shop_like WHERE alteration_shop_id = ? AND user_id = ?
	`
}

module.exports = AlterationShopQuery;
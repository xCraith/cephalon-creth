interface Order {
	id: string;
	platinum: number;
	quantity: number;
	order_type: string;
	platform: string;
	region: string;
	creation_date: string;
	last_update: string;
	subtype: string;
	visible: boolean;
	user: {
		id: string;
		ingame_name: string;
		status: string;
		region: string;
		reputation: number;
		avatar: string | null; // Adjust avatar to be string or null
		last_seen: string;
	};
	item: Item; // Adjust to directly reference the Item interface
	include?: Include;
}

interface Include {
	item?: Item;
	// Add other properties from the "include" section as needed
}

interface Item {
	id: string;
	items_in_set: ItemInSet[];
	// Define other properties of 'Item'
}

interface ItemInSet {
	id: string;
	url_name: string;
	icon: string;
	icon_format: string;
	thumb: string;
	sub_icon: string;
	mod_max_rank: number;
	subtypes: string[];
	tags: string[];
	ducats: number;
	quantity_for_set: number;
	set_root: boolean;
	mastery_level: number;
	rarity: string;
	trading_tax: number;
	// Define other properties of 'ItemInSet'
}

// Export all the types
export { Order, Include, Item, ItemInSet };

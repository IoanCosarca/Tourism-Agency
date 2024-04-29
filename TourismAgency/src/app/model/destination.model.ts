export interface DestinationModel {
	id: number,
	name: string;
	location: string;
	image: File | null;
	description: string;
	pricePerNight: string;
	spots: number;
	discount: number;
}

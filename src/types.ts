export interface Artwork {
  id: string;
  number: string; // sequential catalog number, e.g. "01"
  titleZh: string;
  titleEn: string;
  author: string; // empty string if not credited
  descriptionZh: string;
  descriptionEn: string;
  themeZh: string;
  themeEn: string;
  session: string; // e.g. "S2"
  themeColor: string; // hex background for the theme tag
  themeTextColor: string; // hex text color for contrast on themeColor
  imageSrc?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'curator';
  text: string;
  timestamp: string;
}

interface FormattingState {
  linkTitle: string;
  linkTarget: string;
  emoji: string;
  imageName: string;
  imageUrl: string;
  codeLanguage: string;
  codeContent: string;
}

export interface Message {
  id: string;
  _id?: string;
  senderId: string;
  receiverId: string;
  content: string;
  formatting?: FormattingState;
  reactions?: any[];
  createdAt: string;
  image?: string;
  read?: boolean;
}

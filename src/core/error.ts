export interface StdError {
    message: string;
    cause?: unknown;
  }
  
  // シンプルなErrorモデル。必要に応じてErrorトレイト的なインターフェースを追加可。
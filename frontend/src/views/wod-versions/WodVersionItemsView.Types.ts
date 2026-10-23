import type {
  WodVersionItemResponse,
  WodVersionResponse,
} from "../../types/Wod";

export interface WodVersionItemsViewProps {
  items: WodVersionItemResponse[];
  versions: WodVersionResponse[];
  selectedItem: WodVersionItemResponse | null;
  loading: boolean;
  error: string | null;
  onSelectItem: (id: number) => void;
}

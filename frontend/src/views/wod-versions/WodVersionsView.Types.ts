import type {
  WodVersionItemResponse,
  WodVersionResponse,
} from "../../types/Wod";

export interface WodVersionsViewProps {
  versions: WodVersionResponse[];
  selectedVersion: WodVersionResponse | null;
  selectedItems: WodVersionItemResponse[];
  loading: boolean;
  error: string | null;
  onSelectVersion: (id: number) => void;
}

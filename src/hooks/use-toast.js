import { useToast as useToastBase } from "@/components/ui/toast";

export function useToast() {
  const { toast, dismiss, toasts } = useToastBase();
  return { toast, dismiss, toasts };
}
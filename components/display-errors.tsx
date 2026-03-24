import { useApiKeyStore } from "@/store/useApiKeyStore";
import ErrorComponent from "./error";
import LoadingSection from "./loading-section";
import NotFoundApiKeyComponent from "./not-found-api-key";
import NotFoundComponent from "./not-found";

type DisplayErrorsProps<T> = {
  loading: boolean;
  error: string | null;
  data: T | null;
};

function DisplayErrors<T>({ loading, error, data }: DisplayErrorsProps<T>) {
  const { apiKey } = useApiKeyStore();

  if (loading) {
    return <LoadingSection />;
  }

  if (!apiKey) {
    return <NotFoundApiKeyComponent />;
  }

  if (error) {
    return <ErrorComponent error={error} />;
  }

  if (!data || (Array.isArray(data) && data.length === 0)) {
    return <NotFoundComponent />;
  }

  return null;
}

export default DisplayErrors;

import { cleanup, render, renderHook, waitFor } from '@testing-library/react';
import App from './App';
import { Suspense } from 'react';
import { MemoryRouter } from 'react-router-dom';
import {
	QueryClient,
	QueryClientProvider,
	useQuery,
} from '@tanstack/react-query';
import { statsMockData } from './__tests__/__mocks__/statsMockData';

afterEach(cleanup);

export function useCustomHook() {
	return useQuery({ queryKey: ['stats'], queryFn: () => statsMockData });
}

describe('App', () => {
	it('renders the app to the page', async () => {
		const queryClient = new QueryClient();

		const wrapper = ({ children }: { children: React.ReactNode }) => (
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		);

		const { result } = renderHook(() => useCustomHook(), { wrapper });

		await waitFor(() => result.current.isSuccess);

		expect(result.current.data).toEqual(statsMockData);

		queryClient.setQueryData(['stats'], statsMockData);

		const { debug, getByText } = render(
			<QueryClientProvider client={queryClient}>
				<Suspense fallback='Loading...'>
					<MemoryRouter>
						<App />
					</MemoryRouter>
				</Suspense>
			</QueryClientProvider>
		);

		expect(getByText(/Loading.../i)).toBeInTheDocument();
	});

	it('gets data from API', async () => {
		const queryClient = new QueryClient();

		const wrapper = ({ children }: { children: React.ReactNode }) => (
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		);

		const { result } = renderHook(() => useCustomHook(), { wrapper });

		await waitFor(() => result.current.isSuccess);

		expect(result.current.data).toEqual(statsMockData);
	});
});

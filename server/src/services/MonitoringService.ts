import {
	Counter,
	Histogram,
	Registry,
	collectDefaultMetrics,
} from 'prom-client';

class MonitoringService {
	private registry: Registry;
	private routeDurationHistograms: Map<string, Histogram> = new Map();

	private successfulRequestsCounter: Counter;
	private failedRequestsCounter: Counter;
	private requestDurationHistogram: Histogram;

	constructor() {
		this.registry = new Registry();
		collectDefaultMetrics({ register: this.registry });

		this.successfulRequestsCounter = new Counter({
			name: 'api_requests_successful',
			help: 'Total number of successful API requests',
			registers: [this.registry],
		});

		this.failedRequestsCounter = new Counter({
			name: 'api_requests_failed',
			help: 'Total number of failed API requests',
			registers: [this.registry],
		});

		this.requestDurationHistogram = new Histogram({
			name: 'api_request_duration_seconds',
			help: 'Histogram of API request durations',
			registers: [this.registry],
			buckets: [0.1, 0.5, 1, 2, 5],
		});
	}

	incrementSuccessfulRequests(): void {
		this.successfulRequestsCounter.inc();
	}

	incrementFailedRequests(): void {
		this.failedRequestsCounter.inc();
	}

	recordRequestDuration(duration: number): void {
		this.requestDurationHistogram.observe(duration);
	}

	sanitizeMetricName(name: string): string {
		// Replace invalid characters with underscores
		return name.replace(/[^a-zA-Z0-9_]/g, '_');
	}

	recordRouteRequestDuration(route: string, duration: number): void {
		const sanitizedRoute = this.sanitizeMetricName(route);

		if (!this.routeDurationHistograms.has(sanitizedRoute)) {
			const histogram = new Histogram({
				name: `api_request_${sanitizedRoute}_duration_seconds`,
				help: 'Histogram of API request durations',
				labelNames: ['route'],
				registers: [this.registry],
				buckets: [0.1, 0.5, 1, 2, 5],
			});
			this.routeDurationHistograms.set(sanitizedRoute, histogram);
		}

		this.routeDurationHistograms
			.get(sanitizedRoute)!
			.labels(sanitizedRoute)
			.observe(duration);
	}

	getRegistry() {
		return this.registry;
	}

	async getPrometheusMetrics(): Promise<string> {
		return await this.registry.metrics();
	}
}

export default new MonitoringService();

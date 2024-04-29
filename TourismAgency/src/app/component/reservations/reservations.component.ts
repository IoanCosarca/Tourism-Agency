import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { CalendarInfoModel } from '../../model/calendar-info.model';
import { DestinationModel } from '../../model/destination.model';
import { ReservationModel } from '../../model/reservation.model';
import { UserModel } from "../../model/user.model";
import { DestinationService } from '../../service/destination.service';
import { ReservationService } from '../../service/reservation.service';
import { UserService } from "../../service/user.service";

import {
	CalendarEvent,
	CalendarView,
	CalendarEventTimesChangedEvent
} from 'angular-calendar';
import { isSameDay, isSameMonth } from 'date-fns';
import { ApexChart, ApexXAxis, ChartComponent } from 'ng-apexcharts';
import { Subject } from 'rxjs';

export type ChartOptions = {
	series: {
		name: string;
		data: number[];
	}[];
	chart: ApexChart;
	xaxis: ApexXAxis;
};

@Component({
	selector: 'app-reservations',
	standalone: false,
	templateUrl: './reservations.component.html',
	styleUrl: './reservations.component.css',
})
export class ReservationsComponent implements OnInit {
	destinations: DestinationModel[] = [];
	selectedDestination: DestinationModel | null = null;
	calendarInfo: CalendarInfoModel[] = [];
	view: CalendarView = CalendarView.Month;
	viewDate: Date = new Date();
	refresh: Subject<void> = new Subject<void>();
	events: CalendarEvent<CalendarInfoModel>[] = [];
	activeDayIsOpen: boolean = false;

	@ViewChild('modalContent', { static: true }) modalContent!: TemplateRef<any>;

	modalData!: {
		action: string;
		event: CalendarEvent<CalendarInfoModel>;
	};

	@ViewChild("chart") chart: ChartComponent | undefined;

	chartOptions: Partial<ChartOptions>;

	constructor(
		private modal: NgbModal,
		private destinationService: DestinationService,
		private reservationService: ReservationService,
		private userService: UserService
	) {
		this.chartOptions = {
			series: [{
				name: 'Reservations',
				data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
			}],
			chart: {
				height: 350,
				type: 'bar',
				toolbar: {
					show: false
				}
			},
			xaxis: {
				categories: [
					"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
				]
			}
		};
	}

	ngOnInit(): void {
		this.getDestinations();
		this.viewDate = new Date();
		this.events = [];
		this.refresh.next();
	}

	getDestinations(): void {
		this.destinationService.getDestinations().subscribe(
			(destinations: DestinationModel[]) => {
				this.destinations = destinations;
			},
			(error: any) => {
				console.error('Failed to fetch destinations:', error);
			}
		);
	}

	onDestinationSelect(): void {
		if (this.selectedDestination) {
			this.reservationService.getReservationsByDestination(this.selectedDestination.id).subscribe(
				(reservations: ReservationModel[]) => {
					this.populateCalendar(reservations);
					this.calculateMonthlyReservations(reservations);
				},
				(error: any) => {
					console.error('Failed to fetch reservations:', error);
				}
			);
		}
	}

	populateCalendar(reservations: ReservationModel[]): void {
		this.calendarInfo = [];
		if (reservations.length === 0) {
			this.events = [];
			return;
		}
		reservations.forEach(reservation => {
			this.userService.getUser(reservation.user).subscribe(
				(user: UserModel) => {
					const calendarEvent: CalendarInfoModel = {
						user: user.name,
						start_date: new Date(reservation.start_date),
						end_date: new Date(reservation.end_date),
						color: this.getRandomColor()
					};
					this.calendarInfo.push(calendarEvent);
					this.initializeCalendar();
				},
				(error: any) => {
					console.error('Failed to fetch user details:', error);
				}
			);
		});
	}

	getRandomColor(): string {
		return '#' + Math.floor(Math.random() * 16777215).toString(16);
	}

	initializeCalendar(): void {
		this.events = this.calendarInfo.map((event) => ({
			start: event.start_date,
			end: event.end_date,
			title: event.user,
			color: {
				primary: event.color,
				secondary: event.color,
			},
			meta: event
		}));
	}

	dayClicked({ date, events }: { date: Date; events: CalendarEvent<CalendarInfoModel>[] }): void {
		if (isSameMonth(date, this.viewDate)) {
			if ((isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) || events.length === 0) {
				this.activeDayIsOpen = false;
			} else {
				this.activeDayIsOpen = true;
			}
			this.viewDate = date;
		}
	}

	setView(view: CalendarView) {
		this.view = view;
	}

	eventTimesChanged({
		event,
		newStart,
		newEnd,
	}: CalendarEventTimesChangedEvent<CalendarInfoModel>): void {
		this.events = this.events.map((iEvent) => {
			if (iEvent === event) {
				return {
					...event,
					start: newStart,
					end: newEnd,
				};
			}
			return iEvent;
		});
	}

	handleEvent(action: string, event: CalendarEvent<CalendarInfoModel>): void {
		this.modalData = { event, action };
		this.modal.open(this.modalContent, { size: 'lg' });
	}

	closeOpenMonthViewDay() {
		this.activeDayIsOpen = false;
	}

	calculateMonthlyReservations(reservations: ReservationModel[]): void {
		const monthlyCounts = new Array(12).fill(0);

		// Count reservations for each month
		reservations.forEach(reservation => {
			const month = new Date(reservation.start_date).getMonth();
			monthlyCounts[month]++;
		});

		// Create a new series with the updated data
		const newSeries = [{
			name: 'Reservations',
			data: monthlyCounts
		}];

		// Assign the new series to chartOptions
		this.chartOptions = {
			...this.chartOptions,
			series: newSeries
		};

		// Trigger chart update if the chart component is initialized
		if (this.chart) {
			this.chart.updateOptions(this.chartOptions);
		}
	}
}

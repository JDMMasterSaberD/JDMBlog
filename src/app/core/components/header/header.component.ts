import {Component, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject, filter, map, Observable, Subject, takeUntil, tap} from "rxjs";
import {NavigationEnd, Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
	public isMenuOpen$$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	public vm$?: Observable<{ isMenuOpen: boolean }>
	private destroy$$: Subject<void> = new Subject();

	constructor(private readonly router: Router) {
	}

	public ngOnInit(): void {
		this.vm$ = this.isMenuOpen$$.pipe(
			map((isOpen) => {
				return {
					isMenuOpen: isOpen
				}
			})
		);

		this.router.events
			.pipe(
				takeUntil(this.destroy$$),
				filter(e => e instanceof NavigationEnd),
				tap(() => {
					this.isMenuOpen$$.next(false)
				})
			).subscribe();
	}

	public ngOnDestroy(): void {
		this.destroy$$.next();
	}

	public toggleMenuState(currentState: boolean): void {
		this.isMenuOpen$$.next(!currentState);
	}
}

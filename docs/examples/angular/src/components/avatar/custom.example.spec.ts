import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvatarCustomExampleComponent } from './custom.example';

describe('docs-examples-angular: AvatarCustomExampleComponent', () => {
  let fixture: ComponentFixture<AvatarCustomExampleComponent>;
  let component: AvatarCustomExampleComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvatarCustomExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AvatarCustomExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render the custom avatar instead of the standard one', () => {
    const avatar = fixture.nativeElement.querySelector('.docs-avatar');

    expect(avatar).not.toBeNull();
    expect(avatar.textContent).toContain('TW');
    expect(
      fixture.nativeElement.querySelector('smart-avatar-standard'),
    ).toBeNull();
  });

  it('should render one item per member in group mode', () => {
    const items = fixture.nativeElement.querySelectorAll(
      '.docs-avatar__group-item',
    );

    expect(items.length).toBe(3);
  });

  it('should re-render with the new size class when the size input changes', () => {
    component.size.set('xl');
    fixture.detectChanges();

    const avatar = fixture.nativeElement.querySelector('.docs-avatar');

    expect(avatar.className).toContain('docs-avatar--xl');
  });
});

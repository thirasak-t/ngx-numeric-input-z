# ngx-numeric-input-z

A lightweight Angular directive for numeric input fields with support for:

- Minimum and maximum values
- Optional decimal input with precision control
- Automatic formatting with thousands separator
- Value enforcement on `blur` or `input` event

## 📦 Installation

```bash
npm install ngx-numeric-input-z
```

## 🚀 Usage

Import the directive into your component or feature module (for standalone Angular apps, you can use `standalone: true`):

### Standalone usage

```ts
import { NumericInputDirective } from "ngx-numeric-input-z";

@Component({
  selector: "app-your-component",
  standalone: true,
  imports: [NumericInputDirective],
  template: `<input InputAmount />`,
})
export class YourComponent {}
```

### Module-based usage

```ts
import { NumericInputDirective } from 'ngx-numeric-input-z';

@NgModule({
  declarations: [...],
  imports: [NumericInputDirective],
})
export class YourModule {}
```

## 🧑‍💻 Input Options

| Input           | Type      | Description                                     | Default     |
| --------------- | --------- | ----------------------------------------------- | ----------- |
| `min`           | `number`  | Minimum value                                   | `undefined` |
| `max`           | `number`  | Maximum value                                   | `undefined` |
| `decimalPlaces` | `number`  | Number of allowed decimal places                | `null`      |
| `allowDecimal`  | `boolean` | Whether decimals are allowed                    | `true`      |
| `enforceMax`    | `boolean` | If `true`, restricts input beyond max instantly | `true`      |

## ✨ Example

```html
<input NgxNumericInput [min]="0" [max]="10000" [decimalPlaces]="2" [allowDecimal]="true" [enforceMax]="false" />
```

## 🔗 Resources

- [Angular Documentation](https://angular.dev)
- [Angular CLI](https://angular.dev/tools/cli)

---

## 📝 License

MIT

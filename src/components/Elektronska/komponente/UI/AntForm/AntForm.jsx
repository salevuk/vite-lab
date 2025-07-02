import { createRef, useEffect, useRef } from "react";
import { Button, Form, Input, Switch } from "antd";
import PropTypes from "prop-types";
import AntSelect from "../AntSelect/AntSelect.jsx";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

const pozicijaMapping = {
  lijevo: "flex-start",
  desno: "flex-end",
  centar: "center",
};

const AntForm = ({
  fields = [],
  labelSpan = 4,
  wrapperSpan = 16,
  switchLabelSpan = 12,
  switchWrapperSpan = 10,
  form,
  onValuesChange,
  layout,
  buttonHandler,
  buttonIcon,
  buttonStyle,
  buttonLoading,
  submitButtonText = "Pošalji",
  pozicijaDugmeta = "center",
  buttonClickHandler,
  prikaziDugme = false,
  customButtons = [],
  flexDirection = "row",
}) => {
  const refs = useRef(
    fields.reduce((acc, field) => {
      acc[field.name] = createRef();
      return acc;
    }, {})
  );

  useEffect(() => {
    fields.forEach((field) => {
      if (field.autoFocus && refs.current[field.name]) {
        refs.current[field.name].current.focus();
      }
    });
  }, [fields]);

  return (
    <Form
      labelCol={{ span: labelSpan }}
      form={form}
      wrapperCol={{ span: wrapperSpan }}
      onValuesChange={onValuesChange}
      layout={layout}
      onFinish={buttonHandler}
    >
      {fields.length > 0 ? (
        fields.map((field) => {
          let InputComponent;
          let extraProps = {
            disabled: field.disabled || false, // Set disabled property
            size: field.size || "middle", // Velicina polja
          };

          if (field.type === "select") {
            InputComponent = AntSelect;
            extraProps = {
              ...extraProps,
              options: field.options || [],
              mode: field.mode,
              maxCount: field.maxCount,
              status: field.status,
              size: field.size,
              allowClear: field.allowClear,
              onClear: field.onClear,
              isLoading: field.isLoading,
              style: field.style,
              onSelectChange: (value) => {
                form.setFieldsValue({ [field.name]: value }); // Update value in form
                if (field.onSelectChange) {
                  field.onSelectChange(value);
                }
              },
            };
          } else if (field.type === "switch") {
            InputComponent = Switch; // Ant Design Switch
            extraProps = {
              ...extraProps,
              checkedChildren: <CheckOutlined />, // checked icon
              unCheckedChildren: <CloseOutlined />, // unchecked icon
              defaultChecked: field.defaultChecked || false, // default value
            };
          } else {
            InputComponent =
              field.name === "kod"
                ? Input.OTP
                : field.type === "password"
                ? Input.Password
                : Input;
            extraProps = {
              ...extraProps,
              prefix: field.prefix || null,
              suffix: field.suffix || null,
            };
          }

          // Determine value for labelCol and wrapperCol
          const labelColValue =
            field.type === "switch" ? switchLabelSpan : labelSpan;
          const wrapperColValue =
            field.type === "switch" ? switchWrapperSpan : wrapperSpan;

          return (
            <Form.Item
              key={field.name}
              label={field.label}
              name={field.name}
              rules={field.rules}
              labelCol={{ span: labelColValue }}
              wrapperCol={{ span: wrapperColValue }}
            >
              <InputComponent
                placeholder={field.placeholder}
                ref={refs.current[field.name]}
                {...extraProps}
              />
            </Form.Item>
          );
        })
      ) : (
        <div>Polja nisu proslijeđena</div>
      )}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: pozicijaMapping[pozicijaDugmeta],
          gap: "10px",
          flexDirection: flexDirection,
        }}
      >
        {prikaziDugme ? (
          <Button
            type="primary"
            htmlType="submit"
            icon={buttonIcon}
            style={buttonStyle}
            loading={buttonLoading}
            onClick={buttonClickHandler}
          >
            {submitButtonText}
          </Button>
        ) : null}
        {customButtons.map((button, index) => (
          <Button
            key={index}
            type={button.type || "default"}
            icon={button.icon}
            style={button.style}
            loading={button.loading}
            onClick={button.onClick}
            danger={button.danger}
            disabled={button.disabled}
            ghost={button.ghost}
          >
            {button.text}
          </Button>
        ))}
      </div>
    </Form>
  );
};

AntForm.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string,
      rules: PropTypes.arrayOf(
        PropTypes.oneOfType([
          PropTypes.shape({
            required: PropTypes.bool,
            message: PropTypes.string,
          }),
          PropTypes.func,
        ])
      ),
      placeholder: PropTypes.string,
      type: PropTypes.string,
      options: PropTypes.arrayOf(PropTypes.object), // Za AntSelect
      mode: PropTypes.string, // Za AntSelect
      maxCount: PropTypes.number, // Za AntSelect
      status: PropTypes.string, // Za AntSelect
      size: PropTypes.string, // Za AntSelect
      disabled: PropTypes.bool, // Za AntSelect
      allowClear: PropTypes.bool, // Za AntSelect
      onClear: PropTypes.func, // Za AntSelect
      isLoading: PropTypes.bool, // Za AntSelect
      style: PropTypes.object, // Za AntSelect
      onSelectChange: PropTypes.func, // Za AntSelect
      autoFocus: PropTypes.bool, // Dodana autoFocus opcija
      prefix: PropTypes.node, // prefix opcija za input polje
    })
  ),
  labelSpan: PropTypes.number,
  wrapperSpan: PropTypes.number,
  switchLabelSpan: PropTypes.number, // switch label span
  switchWrapperSpan: PropTypes.number, // switch wrapper span
  form: PropTypes.object.isRequired,
  onValuesChange: PropTypes.func,
  layout: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  buttonHandler: PropTypes.func,
  buttonIcon: PropTypes.node,
  buttonStyle: PropTypes.object,
  submitButtonText: PropTypes.string, // Submit dugme tekst
  buttonLoading: PropTypes.bool,
  pozicijaDugmeta: PropTypes.oneOf(["lijevo", "desno", "centar"]),
  buttonClickHandler: PropTypes.func,
  prikaziDugme: PropTypes.bool,
  customButtons: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string,
      icon: PropTypes.node,
      style: PropTypes.object,
      loading: PropTypes.bool,
      onClick: PropTypes.func,
      text: PropTypes.string.isRequired,
      danger: PropTypes.bool,
      disabled: PropTypes.bool,
      ghost: PropTypes.bool,
    })
  ), // prop za custom dugmad
  flexDirection: PropTypes.oneOf(["row", "column"]),
};

export default AntForm;

/**
 * Komponenta `AntForm`
 *
 * Komponenta `AntForm` je fleksibilna forma koja omogućava dinamičko generisanje input polja baziranih na konfiguraciji koja se proslijeđuje kroz `fields` prop. Komponenta koristi Ant Design biblioteku za stilizaciju i interakciju sa korisnikom.
 *
 * Props:
 * - **fields** (`Array`): Niz objekata koji definišu polja forme. Svako polje može imati sledeće atribute:
 *   - `name` (`String`, obavezno): Ime polja.
 *   - `label` (`String`): Tekst koji će biti prikazan kao labela za polje.
 *   - `rules` (`Array`): Niz objekata za validaciju polja.
 *   - `placeholder` (`String`): Tekst koji će biti prikazan unutar input polja kada nije popunjeno.
 *   - `type` (`String`): Tip polja (`text`, `password`, `select`, `switch`).
 *   - `options` (`Array`): Opcije za select polja.
 *   - `mode` (`String`): Mod za select polja (`multiple`, `tags`).
 *   - `maxCount` (`Number`): Maksimalan broj selekcija za select polja.
 *   - `status` (`String`): Status polja (npr. `error`, `warning`).
 *   - `size` (`String`): Veličina polja (npr. `large`, `small`).
 *   - `disabled` (`Boolean`): Da li je polje onemogućeno.
 *   - `allowClear` (`Boolean`): Da li polje dozvoljava brisanje sadržaja.
 *   - `onClear` (`Function`): Funkcija koja će se pozvati kada se polje očisti.
 *   - `isLoading` (`Boolean`): Da li je polje u stanju učitavanja (korisno za select polja).
 *   - `style` (`Object`): Stilovi koji će biti primenjeni na polje.
 *   - `onSelectChange` (`Function`): Funkcija koja će se pozvati kada se vrednost u select polju promeni.
 *   - `autoFocus` (`Boolean`): Da li polje treba biti automatski fokusirano prilikom učitavanja forme.
 *   - `defaultChecked` (`Boolean`): Početno stanje switch polja (da li je čekirano ili ne).
 *
 * - **labelSpan** (`Number`): Broj kolona za labelu (default: 4).
 * - **wrapperSpan** (`Number`): Broj kolona za input polje (default: 16).
 * - **switchLabelSpan** (`Number`): Broj kolona za labelu kod switch polja (default: 12).
 * - **switchWrapperSpan** (`Number`): Broj kolona za input polje kod switch polja (default: 10).
 * - **form** (`Object`, obavezno): Ant Design instanca forme.
 * - **onValuesChange** (`Function`): Funkcija koja će se pozvati kada se vrednosti u formi promene.
 * - **layout** (`String` | `Object`): Layout forme (horizontalni, vertikalni ili inline).
 * - **buttonHandler** (`Function`): Funkcija koja će se pozvati kada se forma submituje.
 * - **buttonIcon** (`Node`): Ikonica koja će biti prikazana unutar submit dugmeta.
 * - **buttonStyle** (`Object`): Stilovi za submit dugme.
 * - **submitButtonText** (`String`): Tekst unutar submit dugmeta (default: "Pošalji").
 * - **buttonLoading** (`Boolean`): Da li je submit dugme u stanju učitavanja.
 * - **pozicijaDugmeta** (`String`): Pozicija submit dugmeta (`lijevo`, `desno`, `centar`) (default: "centar").
 * - **buttonClickHandler** (`Function`): Funkcija koja će se pozvati kada se klikne na submit dugme.
 * - **prikaziDugme** (`Boolean`): Da li će submit dugme biti prikazano (default: false).
 *
 * Kako koristiti komponentu `AntForm`:
 * 1. **Definišite polja**: Napravite niz objekata koji definišu svako polje forme. Svaki objekat mora imati najmanje `name` atribut, dok su ostali atributi opcionalni.
 *
 * ```javascript
 * const prijavaFormFields = [
 *     {
 *         name: 'korisnicko_ime',
 *         label: 'Korisničko ime',
 *         rules: [{ required: true, message: 'Polje je obavezno' }],
 *         placeholder: 'Unesite korisničko ime',
 *         type: 'text',
 *         autoFocus: true, // Polje će biti automatski fokusirano prilikom učitavanja forme
 *     },
 *     {
 *         name: 'lozinka',
 *         label: 'Lozinka',
 *         rules: [{ required: true, message: 'Polje je obavezno' }],
 *         placeholder: 'Unesite lozinku',
 *         type: 'password',
 *     },
 * ];
 * ```
 *
 * 2. **Koristite `AntForm` komponentu**: Prosledite `fields`, `form`, i ostale potrebne props vrednosti `AntForm` komponenti.
 *
 * ```javascript
 * import React from 'react';
 * import { Form } from 'antd';
 * import AntForm from './AntForm';
 *
 * const MyComponent = () => {
 *     const [form] = Form.useForm();
 *
 *     const handleFormSubmit = (values) => {
 *         console.log('Submitted values:', values);
 *     };
 *
 *     return (
 *         <AntForm
 *             fields={prijavaFormFields}
 *             form={form}
 *             buttonHandler={handleFormSubmit}
 *             prikaziDugme={true}
 *         />
 *     );
 * };
 *
 * export default MyComponent;
 * ```
 */

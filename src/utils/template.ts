/**
 * Replace keys in template with according values.
 */
export function fillTemplateString(template: string, data: IKeyValuePair[]) {
  data.forEach(({ key, value }) => {
    template = template.replace(new RegExp(`\\$\\(${key}\\)`, 'gm'), value);
  });
  return template;
}

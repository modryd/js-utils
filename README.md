# js-utils
Utils in JavaScript

# edit-elements:

```html
<div contenteditable data-property="column" data-conditions="row_id:1" data-domain="xxx">Value</div>
<script type="module">
    (new Contenteditable())
      .setEndpoint("/update")
      .setDomain("xxx")
      .setCSRFToken(csrf)
      .fire();
</script>
```

## Contenteditable

## Selectboxable

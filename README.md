# js-utils
Utils in JavaScript

# edit-elements:

```html
<div contenteditable
    data-property="column"
    data-conditions="row_id:1"
    data-domain="xxx"
>Value</div>

<script type="module">
    (new Contenteditable())
      .setEndpoint("/update")
      .setDomain("xxx")
      .setCSRFToken(csrf)
      .fire();
</script>
```

## Contenteditable
![Contenteditable](https://github.com/user-attachments/assets/dbc0892a-fa81-4e43-9912-7f42ef69497b)

## Fileuploadable

## Selectboxable
![Selectboxable](https://github.com/user-attachments/assets/5cce3125-5076-4179-8bf8-6aafe0eb1290)

## Verify
Shows a modal window asking for Yes/No
Usage:
```html
<a href="/delete/1"
    class="btn btn-danger"
    data-action="verify"
    data-description="Delete first thing"
>
    Delete
</a>
<script type="module">
  (new Verify()).fire();
</script>


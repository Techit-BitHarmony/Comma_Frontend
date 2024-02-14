<script>
    import {page} from "$app/stores";  
  

  let code = $page.url.searchParams.get('code');
  let message = $page.url.searchParams.get('message');
  
</script>


<div>
    <h2> 결제 실패 </h2>
    <p>Error Code : {code}</p>
    <p>Error Message : {message}</p>
</div>
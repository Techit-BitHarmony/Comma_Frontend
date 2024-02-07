<script>
  import { onMount } from 'svelte';

export let paymentWidget;
export let username; 
export let chargeAmount; 
export let chargeCode; 

  onMount(() => {
    const widgetClientKey = 'test_ck_5OWRapdA8dmGZpoK9jpA3o1zEqZK';
    const customerKey = username;
    paymentWidget = PaymentWidget(widgetClientKey, customerKey);

    paymentWidget.renderPaymentMethods(
      "#payment-method",
      { value: chargeAmount },
      { variantKey: "DEFAULT" }
    );

    paymentWidget.renderAgreement(
      "#agreement", 
      { variantKey: "AGREEMENT" }
    );
  });

  function handlePayment() {
    paymentWidget.requestPayment({
      orderId: chargeCode,
      orderName: "크레딧 충전",
      successUrl: window.location.origin + "/credit/charge/payment/success",
      failUrl: window.location.origin + "/credit/charge/payment/fail",
    });
  }
</script>

<div>
  <div id="payment-method"></div>
  <div id="agreement"></div>
  <button on:click={handlePayment}>결제하기</button>
</div>
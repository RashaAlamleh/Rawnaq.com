from django.http import HttpResponse, JsonResponse
from django.contrib import messages
from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.mixins import LoginRequiredMixin
from django.core.exceptions import ObjectDoesNotExist
from django.views.generic import ListView, DetailView, View
from django.utils import timezone
from django.contrib.auth.models import User
from django.contrib.auth import views
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import login, authenticate
from django.contrib.auth.decorators import login_required
from .models import (Item, Order, OrderItem)
from django.views.decorators.csrf import csrf_exempt

from rest_framework import generics, permissions
from rest_framework.authtoken.serializers import AuthTokenSerializer
from rest_framework.permissions import AllowAny
from rest_framework.parsers import JSONParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import (ListAPIView, RetrieveAPIView, CreateAPIView,UpdateAPIView)
from knox.models import AuthToken
from knox.views import LoginView as KnoxLoginView

from . serializers import *
from .models import *
from .forms import CheckoutForm
import stripe



# @login_required
def index(request):
    return render(request,'../templates/registration/index.html')
def sign_up(request):
    context = {}
    form = UserCreationForm(request.POST or None)
    if request.method == "POST":
        if form.is_valid():
            user = form.save()
            login(request,user)
            # login(request, user, backend='django.contrib.auth.backends.ModelBackend')
            return render(request,'../templates/registration/index.html') 
    context['form']=form
    return render(request,'../templates/registration/sign_up.html',context) 

    
class HomeView(ListView):
    model = Item
    template_name = "home.html"

class UserProfileView(APIView):
    def get(self, request, *args, **kwargs):
        return Response({"user","stripe_customer_id"})
        

class RegisterAPI(generics.GenericAPIView):
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
        "user": UserSerializer(user, context=self.get_serializer_context()).data,
        "token": AuthToken.objects.create(user)[1]
        })

class LoginAPI(KnoxLoginView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        serializer = AuthTokenSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        login(request, user)
        return super(LoginAPI, self).post(request, format=None)

class ItemListView(ListAPIView):
    permission_classes = (AllowAny,)
    serializer_class = ItemSerializer
    queryset = Item.objects.all()
    
class ProductView(DetailView) :
    model = Item
    template_name = "product.html"


class OrderSummaryView(LoginRequiredMixin, View):
    def get(self, *args, **kwargs):

        try:
            order = Order.objects.get(user=self.request.user, ordered=False)
            context = {
                'object' : order
            }
            return render(self.request, 'order_summary.html', context)
        except ObjectDoesNotExist:
            messages.error(self.request, "You do not have an order")
            return redirect("/")


@login_required
def add_to_cart(request, pk):
    item = get_object_or_404(Item, pk=pk )
    order_item, created = OrderItem.objects.get_or_create(
        item = item,
        user = request.user,
        ordered = False
    )
    order_qs = Order.objects.filter(user=request.user, ordered=False)

    if order_qs.exists():
        order = order_qs[0]

        if order.items.filter(item__pk=item.pk).exists():
            order_item.quantity += 1
            order_item.save()
            messages.info(request, "Added quantity Item")
            return redirect("core:order-summary")
        else:
            order.items.add(order_item)
            messages.info(request, "Item added to your cart")
            return redirect("core:order-summary")
    else:
        ordered_date = timezone.now()
        order = Order.objects.create(user=request.user, ordered_date=ordered_date)
        order.items.add(order_item)
        messages.info(request, "Item added to your cart")
        return redirect("core:order-summary")


@login_required
def remove_from_cart(request, pk):
    item = get_object_or_404(Item, pk=pk )
    order_qs = Order.objects.filter(
        user=request.user, 
        ordered=False
    )
    if order_qs.exists():
        order = order_qs[0]
        if order.items.filter(item__pk=item.pk).exists():
            order_item = OrderItem.objects.filter(
                item=item,
                user=request.user,
                ordered=False
            )[0]
            order_item.delete()
            messages.info(request, "Item \""+order_item.item.item_name+"\" remove from your cart")
            return redirect("core:order-summary")
        else:
            messages.info(request, "This Item not in your cart")
            return redirect("core:product", pk=pk)
    else:
        #add message doesnt have order
        messages.info(request, "You do not have an Order")
        return redirect("core:product", pk = pk)


@login_required
def reduce_quantity_item(request, pk):
    item = get_object_or_404(Item, pk=pk )
    order_qs = Order.objects.filter(
        user = request.user, 
        ordered = False
    )
    if order_qs.exists():
        order = order_qs[0]
        if order.items.filter(item__pk=item.pk).exists() :
            order_item = OrderItem.objects.filter(
                item = item,
                user = request.user,
                ordered = False
            )[0]
            if order_item.quantity > 1:
                order_item.quantity -= 1
                order_item.save()
            else:
                order_item.delete()
            messages.info(request, "Item quantity was updated")
            return redirect("core:order-summary")
        else:
            messages.info(request, "This Item not in your cart")
            return redirect("core:order-summary")
    else:
        #add message doesnt have order
        messages.info(request, "You do not have an Order")
        return redirect("core:order-summary")


class CheckoutView(View):
    def get(self, *args, **kwargs):
        form = CheckoutForm()
        order = Order.objects.get(user=self.request.user, ordered=False)
        context = {
            'form': form,
            'order': order
        }
        return render(self.request, 'checkout.html', context)

    def post(self, *args, **kwargs):
        form = CheckoutForm(self.request.POST or None)
        
        try:
            order = Order.objects.get(user=self.request.user, ordered=False)
            if form.is_valid():
                street_address = form.cleaned_data.get('street_address')
                apartment_address = form.cleaned_data.get('apartment_address')
                country = form.cleaned_data.get('country')
                zip = form.cleaned_data.get('zip')
                # TODO: add functionaly for these fields
                # same_billing_address = form.cleaned_data.get('same_billing_address')
                # save_info = form.cleaned_data.get('save_info')
                payment_option = form.cleaned_data.get('payment_option')

                checkout_address = CheckoutAddress(
                    user=self.request.user,
                    street_address=street_address,
                    apartment_address=apartment_address,
                    country=country,
                    zip=zip
                )
                checkout_address.save()
                order.checkout_address = checkout_address
                order.save()

                if payment_option == 'S':
                    return redirect('core:payment', payment_option='stripe')
                elif payment_option == 'P':
                    return redirect('core:payment', payment_option='paypal')
                else:
                    messages.warning(self.request, "Invalid Payment option")
                    return redirect('core:checkout')

        except ObjectDoesNotExist:
            messages.error(self.request, "You do not have an order")
            return redirect("core:order-summary")


stripe.api_key = settings.STRIPE_KEY

# class PaymentView(View):
#     def get(self, *args, **kwargs):
#         order = Order.objects.get(user=self.request.user, ordered=False)
#         context = {
#             'order': order
#         }
#         return render(self.request, "payment.html", context)

#     def post(self, *args, **kwargs):
#         order = Order.objects.get(user=self.request.user, ordered=False)
#         token = self.request.POST.get('stripeToken')
#         amount = int(order.get_total_price() * 100)  #cents

#         try:
#             charge = stripe.Charge.create(
#                 amount=amount,
#                 currency="usd",
#                 source=token
#             )

#             # create payment
#             payment = Payment()
#             payment.stripe_id = charge['id']
#             payment.user = self.request.user
#             payment.amount = order.get_total_price()
#             payment.save()

#             # assign payment to order
#             order.ordered = True
#             order.payment = payment
#             order.save()

#             messages.success(self.request, "Success make an order")
#             return redirect('/')

#         except stripe.error.CardError as e:
#             body = e.json_body
#             err = body.get('error', {})
#             messages.error(self.request, f"{err.get('message')}")
#             return redirect('/')

#         except stripe.error.RateLimitError as e:
#             # Too many requests made to the API too quickly
#             messages.error(self.request, "To many request error")
#             return redirect('/')

#         except stripe.error.InvalidRequestError as e:
#             # Invalid parameters were supplied to Stripe's API
#             messages.error(self.request, "Invalid Parameter")
#             return redirect('/')

#         except stripe.error.AuthenticationError as e:
#             # Authentication with Stripe's API failed
#             # (maybe you changed API keys recently)
#             messages.error(self.request, "Authentication with stripe failed")
#             return redirect('/')

#         except stripe.error.APIConnectionError as e:
#             # Network communication with Stripe failed
#             messages.error(self.request, "Network Error")
#             return redirect('/')

#         except stripe.error.StripeError as e:
#             # Display a very generic error to the user, and maybe send
#             # yourself an email
#             messages.error(self.request, "Something went wrong")
#             return redirect('/')
        
#         except Exception as e:
#             # Something else happened, completely unrelated to Stripe
#             messages.error(self.request, "Not identified error")
#             return redirect('/')
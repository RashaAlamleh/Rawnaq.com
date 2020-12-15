from django.urls import path
from .views import (remove_from_cart,
    reduce_quantity_item,
    add_to_cart,
    ProductView,
    HomeView,
    OrderSummaryView
)
from django.contrib import admin
from . import views

app_name = 'core'

urlpatterns = [
    path('', HomeView.as_view(), name='home'),
    path('product/<pk>/', ProductView.as_view(), name='product'),
    path('order-summary/', OrderSummaryView.as_view(), name='order-summary'),
    path('add-to-cart/<pk>/', add_to_cart, name='add-to-cart'),
    path('remove-from-cart/<pk>/', remove_from_cart, name='remove-from-cart'),
    path('',views.index,name="home"),
    path('accounts/sign_up/',views.sign_up,name="sign-up"),
    path('reduce-quantity-item/<pk>/', reduce_quantity_item,name='reduce-quantity-item')
]





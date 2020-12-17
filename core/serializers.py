from rest_framework import serializers
from django.contrib.auth.models import User
from . models import *


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['user', 'stripe_customer_id']

# User Serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')

# Register Serializer
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(validated_data['username'], validated_data['email'], validated_data['password'])

        return user

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ['itemName','details', 'price','image','quantity','category']

    def get_category(self, obj):
        return obj.get_category_display()

    def get_label(self, obj):
        return obj.get_label_display()

class OrderItemSerializer(serializers.ModelSerializer):
    item = serializers.SerializerMethodField()
    final_price = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = (
            'id',
            'item',
            'item_variations',
            'quantity',
            'final_price'
        )

    def get_item(self, obj):
        return ItemSerializer(obj.item).data

    def get_item_variations(self, obj):
        return ItemVariationDetailSerializer(obj.item_variations.all(), many=True).data

    def get_final_price(self, obj):
        return obj.get_final_price()



class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ['itemName','details', 'price','image','quantity','category']

class CheckoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = CheckoutAddress
        fields = ['user','street_address', 'apartment_address', 'country',
        'zip']


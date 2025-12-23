"""Initial schema - create all tables

Revision ID: 001
Revises:
Create Date: 2024-12-22 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '001'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create users table
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('email', sa.String(255), nullable=False),
        sa.Column('cognito_sub', sa.String(255), nullable=True),
        sa.Column('name', sa.String(255), nullable=True),
        sa.Column('role', sa.Enum('buyer', 'seller', 'admin', name='userrole'), nullable=False, server_default='buyer'),
        sa.Column('email_verified', sa.Boolean(), default=False, nullable=False),
        sa.Column('is_active', sa.Boolean(), default=True, nullable=False),
        # Profile fields
        sa.Column('phone', sa.String(50), nullable=True),
        sa.Column('company', sa.String(255), nullable=True),
        sa.Column('bio', sa.String(1000), nullable=True),
        sa.Column('avatar_url', sa.String(500), nullable=True),
        # Buyer-specific fields
        sa.Column('industries_of_interest', sa.String(500), nullable=True),
        sa.Column('location_preferences', sa.String(500), nullable=True),
        sa.Column('budget_min', sa.Integer(), nullable=True),
        sa.Column('budget_max', sa.Integer(), nullable=True),
        # Timestamps
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.Column('last_login_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index('ix_users_email', 'users', ['email'], unique=True)
    op.create_index('ix_users_cognito_sub', 'users', ['cognito_sub'], unique=True)

    # Create listings table
    op.create_table(
        'listings',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('seller_id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(255), nullable=False),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('industry', sa.String(100), nullable=False),
        sa.Column('sub_industry', sa.String(100), nullable=True),
        sa.Column('location', sa.String(255), nullable=False),
        sa.Column('city', sa.String(100), nullable=True),
        sa.Column('state', sa.String(100), nullable=True),
        sa.Column('country', sa.String(100), default='USA', nullable=False),
        sa.Column('asking_price', sa.Integer(), nullable=False),
        sa.Column('revenue', sa.Integer(), nullable=True),
        sa.Column('profit', sa.Integer(), nullable=True),
        sa.Column('cash_flow', sa.Integer(), nullable=True),
        sa.Column('ebitda', sa.Integer(), nullable=True),
        sa.Column('year_established', sa.Integer(), nullable=True),
        sa.Column('employees', sa.Integer(), nullable=True),
        sa.Column('reason_for_sale', sa.String(500), nullable=True),
        sa.Column('business_highlights', sa.Text(), nullable=True),
        sa.Column('status', sa.Enum('DRAFT', 'PENDING', 'ACTIVE', 'UNDER_OFFER', 'SOLD', 'WITHDRAWN', name='listingstatus'), nullable=False),
        sa.Column('is_featured', sa.Boolean(), default=False, nullable=False),
        sa.Column('keywords', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.Column('published_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['seller_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index('ix_listings_seller_id', 'listings', ['seller_id'])
    op.create_index('ix_listings_industry', 'listings', ['industry'])
    op.create_index('ix_listings_state', 'listings', ['state'])
    op.create_index('ix_listings_asking_price', 'listings', ['asking_price'])
    op.create_index('ix_listings_status', 'listings', ['status'])
    op.create_index('ix_listings_is_featured', 'listings', ['is_featured'])

    # Create listing_documents table
    op.create_table(
        'listing_documents',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('listing_id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('document_type', sa.Enum('FINANCIAL_STATEMENT', 'TAX_RETURN', 'BANK_STATEMENT', 'BUSINESS_PLAN', 'LEASE_AGREEMENT', 'INVENTORY_LIST', 'EMPLOYEE_LIST', 'OTHER', name='documenttype'), nullable=False),
        sa.Column('s3_key', sa.String(500), nullable=False),
        sa.Column('file_size', sa.Integer(), nullable=True),
        sa.Column('mime_type', sa.String(100), nullable=True),
        sa.Column('requires_nda', sa.Boolean(), default=True, nullable=False),
        sa.Column('is_encrypted', sa.Boolean(), default=True, nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['listing_id'], ['listings.id'], ),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index('ix_listing_documents_listing_id', 'listing_documents', ['listing_id'])

    # Create saved_listings table
    op.create_table(
        'saved_listings',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('listing_id', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['listing_id'], ['listings.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index('ix_saved_listings_user_id', 'saved_listings', ['user_id'])
    op.create_index('ix_saved_listings_listing_id', 'saved_listings', ['listing_id'])

    # Create inquiries table
    op.create_table(
        'inquiries',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('listing_id', sa.Integer(), nullable=False),
        sa.Column('buyer_id', sa.Integer(), nullable=False),
        sa.Column('subject', sa.String(255), nullable=False),
        sa.Column('status', sa.Enum('PENDING', 'RESPONDED', 'CLOSED', name='inquirystatus'), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['buyer_id'], ['users.id'], ),
        sa.ForeignKeyConstraint(['listing_id'], ['listings.id'], ),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index('ix_inquiries_listing_id', 'inquiries', ['listing_id'])
    op.create_index('ix_inquiries_buyer_id', 'inquiries', ['buyer_id'])

    # Create inquiry_messages table
    op.create_table(
        'inquiry_messages',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('inquiry_id', sa.Integer(), nullable=False),
        sa.Column('sender_id', sa.Integer(), nullable=False),
        sa.Column('message', sa.Text(), nullable=False),
        sa.Column('is_read', sa.Boolean(), default=False, nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['inquiry_id'], ['inquiries.id'], ),
        sa.ForeignKeyConstraint(['sender_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index('ix_inquiry_messages_inquiry_id', 'inquiry_messages', ['inquiry_id'])

    # Create ndas table
    op.create_table(
        'ndas',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('listing_id', sa.Integer(), nullable=False),
        sa.Column('buyer_id', sa.Integer(), nullable=False),
        sa.Column('status', sa.Enum('PENDING', 'SENT', 'SIGNED', 'REJECTED', 'EXPIRED', name='ndastatus'), nullable=False),
        sa.Column('document_url', sa.String(500), nullable=True),
        sa.Column('signed_document_url', sa.String(500), nullable=True),
        sa.Column('ip_address', sa.String(50), nullable=True),
        sa.Column('user_agent', sa.String(500), nullable=True),
        sa.Column('requested_at', sa.DateTime(), nullable=False),
        sa.Column('sent_at', sa.DateTime(), nullable=True),
        sa.Column('signed_at', sa.DateTime(), nullable=True),
        sa.Column('expires_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['buyer_id'], ['users.id'], ),
        sa.ForeignKeyConstraint(['listing_id'], ['listings.id'], ),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index('ix_ndas_listing_id', 'ndas', ['listing_id'])
    op.create_index('ix_ndas_buyer_id', 'ndas', ['buyer_id'])

    # Create subscriptions table
    op.create_table(
        'subscriptions',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('stripe_subscription_id', sa.String(255), nullable=True),
        sa.Column('stripe_customer_id', sa.String(255), nullable=True),
        sa.Column('plan', sa.Enum('FREE', 'BASIC', 'PREMIUM', 'ENTERPRISE', name='subscriptionplan'), nullable=False),
        sa.Column('status', sa.Enum('ACTIVE', 'PAST_DUE', 'CANCELED', 'UNPAID', 'TRIALING', name='subscriptionstatus'), nullable=False),
        sa.Column('current_period_start', sa.DateTime(), nullable=True),
        sa.Column('current_period_end', sa.DateTime(), nullable=True),
        sa.Column('cancel_at_period_end', sa.Boolean(), default=False, nullable=False),
        sa.Column('canceled_at', sa.DateTime(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index('ix_subscriptions_user_id', 'subscriptions', ['user_id'])
    op.create_index('ix_subscriptions_stripe_subscription_id', 'subscriptions', ['stripe_subscription_id'], unique=True)

    # Create valuation_purchases table
    op.create_table(
        'valuation_purchases',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('listing_id', sa.Integer(), nullable=False),
        sa.Column('stripe_payment_intent_id', sa.String(255), nullable=True),
        sa.Column('amount', sa.Integer(), nullable=False),
        sa.Column('currency', sa.String(10), default='usd', nullable=False),
        sa.Column('status', sa.String(50), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['listing_id'], ['listings.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index('ix_valuation_purchases_user_id', 'valuation_purchases', ['user_id'])
    op.create_index('ix_valuation_purchases_listing_id', 'valuation_purchases', ['listing_id'])

    # Create valuations table
    op.create_table(
        'valuations',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('listing_id', sa.Integer(), nullable=False),
        sa.Column('dcf_value', sa.Integer(), nullable=True),
        sa.Column('comparable_value', sa.Integer(), nullable=True),
        sa.Column('asset_value', sa.Integer(), nullable=True),
        sa.Column('ai_recommended_value', sa.Integer(), nullable=True),
        sa.Column('confidence_score', sa.Float(), nullable=True),
        sa.Column('methodology', sa.Text(), nullable=True),
        sa.Column('ai_analysis', sa.Text(), nullable=True),
        sa.Column('comparable_listings', sa.Text(), nullable=True),
        sa.Column('risk_factors', sa.Text(), nullable=True),
        sa.Column('growth_potential', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['listing_id'], ['listings.id'], ),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index('ix_valuations_listing_id', 'valuations', ['listing_id'])

    # Create browsing_history table
    op.create_table(
        'browsing_history',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('listing_id', sa.Integer(), nullable=False),
        sa.Column('viewed_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['listing_id'], ['listings.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index('ix_browsing_history_user_id', 'browsing_history', ['user_id'])
    op.create_index('ix_browsing_history_listing_id', 'browsing_history', ['listing_id'])

    # Create search_history table
    op.create_table(
        'search_history',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('query', sa.String(500), nullable=False),
        sa.Column('filters', sa.Text(), nullable=True),
        sa.Column('results_count', sa.Integer(), nullable=True),
        sa.Column('searched_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index('ix_search_history_user_id', 'search_history', ['user_id'])

    # Create analytics_events table
    op.create_table(
        'analytics_events',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=True),
        sa.Column('event_type', sa.Enum('PAGE_VIEW', 'LISTING_VIEW', 'SEARCH', 'SAVE_LISTING', 'INQUIRY_SENT', 'NDA_REQUESTED', 'NDA_SIGNED', 'VALUATION_PURCHASED', 'SUBSCRIPTION_STARTED', name='eventtype'), nullable=False),
        sa.Column('metadata', sa.Text(), nullable=True),
        sa.Column('ip_address', sa.String(50), nullable=True),
        sa.Column('user_agent', sa.String(500), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index('ix_analytics_events_user_id', 'analytics_events', ['user_id'])
    op.create_index('ix_analytics_events_event_type', 'analytics_events', ['event_type'])
    op.create_index('ix_analytics_events_created_at', 'analytics_events', ['created_at'])


def downgrade() -> None:
    # Drop tables in reverse order of creation (respecting foreign keys)
    op.drop_table('analytics_events')
    op.drop_table('search_history')
    op.drop_table('browsing_history')
    op.drop_table('valuations')
    op.drop_table('valuation_purchases')
    op.drop_table('subscriptions')
    op.drop_table('ndas')
    op.drop_table('inquiry_messages')
    op.drop_table('inquiries')
    op.drop_table('saved_listings')
    op.drop_table('listing_documents')
    op.drop_table('listings')
    op.drop_table('users')

    # Drop enums
    op.execute('DROP TYPE IF EXISTS eventtype')
    op.execute('DROP TYPE IF EXISTS subscriptionstatus')
    op.execute('DROP TYPE IF EXISTS subscriptionplan')
    op.execute('DROP TYPE IF EXISTS ndastatus')
    op.execute('DROP TYPE IF EXISTS inquirystatus')
    op.execute('DROP TYPE IF EXISTS documenttype')
    op.execute('DROP TYPE IF EXISTS listingstatus')
    op.execute('DROP TYPE IF EXISTS userrole')

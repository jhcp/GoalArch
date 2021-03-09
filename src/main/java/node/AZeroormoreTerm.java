/* This file was generated by SableCC (http://www.sablecc.org/). */

package node;

import analysis.*;

@SuppressWarnings("nls")
public final class AZeroormoreTerm extends PTerm
{
    private PTerm _term_;
    private TTimes _times_;

    public AZeroormoreTerm()
    {
        // Constructor
    }

    public AZeroormoreTerm(
        @SuppressWarnings("hiding") PTerm _term_,
        @SuppressWarnings("hiding") TTimes _times_)
    {
        // Constructor
        setTerm(_term_);

        setTimes(_times_);

    }

    @Override
    public Object clone()
    {
        return new AZeroormoreTerm(
            cloneNode(this._term_),
            cloneNode(this._times_));
    }

    @Override
    public void apply(Switch sw)
    {
        ((Analysis) sw).caseAZeroormoreTerm(this);
    }

    public PTerm getTerm()
    {
        return this._term_;
    }

    public void setTerm(PTerm node)
    {
        if(this._term_ != null)
        {
            this._term_.parent(null);
        }

        if(node != null)
        {
            if(node.parent() != null)
            {
                node.parent().removeChild(node);
            }

            node.parent(this);
        }

        this._term_ = node;
    }

    public TTimes getTimes()
    {
        return this._times_;
    }

    public void setTimes(TTimes node)
    {
        if(this._times_ != null)
        {
            this._times_.parent(null);
        }

        if(node != null)
        {
            if(node.parent() != null)
            {
                node.parent().removeChild(node);
            }

            node.parent(this);
        }

        this._times_ = node;
    }

    @Override
    public String toString()
    {
        return ""
            + toString(this._term_)
            + toString(this._times_);
    }

    @Override
    void removeChild(@SuppressWarnings("unused") Node child)
    {
        // Remove child
        if(this._term_ == child)
        {
            this._term_ = null;
            return;
        }

        if(this._times_ == child)
        {
            this._times_ = null;
            return;
        }

        throw new RuntimeException("Not a child.");
    }

    @Override
    void replaceChild(@SuppressWarnings("unused") Node oldChild, @SuppressWarnings("unused") Node newChild)
    {
        // Replace child
        if(this._term_ == oldChild)
        {
            setTerm((PTerm) newChild);
            return;
        }

        if(this._times_ == oldChild)
        {
            setTimes((TTimes) newChild);
            return;
        }

        throw new RuntimeException("Not a child.");
    }
}
